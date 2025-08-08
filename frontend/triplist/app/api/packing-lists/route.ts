import client from "../../../lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";

import { fetchWeatherApi } from "openmeteo";
import OpenAI from "openai";


export const GET = auth(async function GET(req) {
  try {
    const c = await client;
    const db = c.db(process.env.MONGODB_DB);
    const data = await db
      .collection("packing-lists")
      .find({ userId: new ObjectId(req.auth?.user?.id) })
      .toArray();
    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});

export const POST = auth(async function POST(req) {
  // Ensure the user is authenticated
  // if (!req.auth)
  //   return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const mongoClient = await client;
    const db = mongoClient.db(process.env.MONGODB_DB);
    const openrouter = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });
    const { latitude: latitude_req, longitude: longitude_req, location_name } =
      await req.json();

    const params = {
      latitude: latitude_req,
      longitude: longitude_req,
      forecast_days: 16,
      daily: [
        "temperature_2m_min",
        "temperature_2m_max",
        "precipitation_sum",
        "precipitation_probability_max",
        "weather_code",
      ],
      temperature_unit: "fahrenheit",
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    const daily = response.daily()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      daily: {
        temperature_2m_min: daily.variables(0)!.valuesArray(),
        temperature_2m_max: daily.variables(1)!.valuesArray(),
        precipitation_sum: daily.variables(2)!.valuesArray(),
        precipitation_probability_max: daily.variables(3)!.valuesArray(),
        weather_code: daily.variables(4)!.valuesArray(),
      },
    };

    const completion = (await openrouter.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant helping a user pack for their trip. You will be provided the location and weather, please generate a list of things for the user to pack (as an array of strings with no additonal text styling) and a quick summary of the reasoning for the items (as a string called 'context'). There should be no text styling including new line characters in the response, just a JSON object with the two fields. Try to add an emoji next to each item",
        },
        {
          role: "user",
          content:
            "The user is going to a location with the following weather data: " +
            JSON.stringify(weatherData),
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "PackingList",
          strict: true,
          schema: {
            type: "object",
            properties: {
              itemList: {
                type: "array",
                items: { type: "string" },
                description: "List of items to pack",
              },
              context: {
                type: "string",
                description: "Summary of reasoning for the items",
              },
            },
            required: ["itemList", "context"],
            additionalProperties: false,
            strict: true,
          },
        },
      },
    })) as unknown;
    // @ts-expect-error - OpenAI types are not fully compatible with OpenRouter
    const res = completion.choices[0].message.content;
    console.log(res);
    const parsedRepsonse = JSON.parse(res);
    console.log(parsedRepsonse);

    const mappedItemList = parsedRepsonse.itemList.map((item: string) => ({
      label: item,
      checked: false,
    }));

    const result = await db.collection("packing-lists").insertOne({
      itemList: mappedItemList,
      context: parsedRepsonse.context,
      location: location_name,
      userId: new ObjectId(req.auth?.user?.id),
    });

    return NextResponse.json({
      itemList: parsedRepsonse.itemList,
      context: parsedRepsonse.context,
      id: result.insertedId.toString(),
      message: "Packing list created successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
