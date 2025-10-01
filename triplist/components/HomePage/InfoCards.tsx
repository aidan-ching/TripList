import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Info = [
  {
    title: "Collaborative Packing",
    description:
      "Share your packing list with friends and family to ensure everyone is prepared for the trip.",
  },
  {
    title: "Weather Aware Packing",
    description:
      "Get packing suggestions based on the weather forecast for your destination.",
  },
  {
    title: "Smart Packing",
    description:
      "Receive intelligent packing suggestions based on your trip details and preferences.",
  },
  //   {
  //     title: "Trip Planning",
  //     description:
  //       "Plan your trip with ease, including destinations, activities, and accommodations.",
  //   },
  //   {
  //     title: "User-Friendly Interface",
  //     description:
  //       "Enjoy a simple and intuitive interface for effortless trip planning.",
  //   },
];

export default function InfoCards() {
  return (
    <div className="flex flex-row gap-5">
      {Info.map((info, index) => (
        <Card key={index} className="max-w-xs">
          <CardHeader>
            <CardTitle>{info.title}</CardTitle>
          </CardHeader>
          <CardContent>{info.description}</CardContent>
        </Card>
      ))}
    </div>
  );
}
