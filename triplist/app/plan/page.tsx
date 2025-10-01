"use client";

import { LocationCombobox } from "@/components/LocationComboboxes/LocationCombobox";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";
import { Button } from "@/components/ui/button";
import { Plane, Loader2Icon } from "lucide-react";

export default function Plan() {
  const router = useRouter();
  const countries = Country.getAllCountries();
  const [selectedCountry, setSelectedCountry] = useState<ICountry | undefined>(
    undefined
  );
  const [selectedState, setSelectedState] = useState<IState | undefined>(
    undefined
  );
  const [selectedCity, setSelectedCity] = useState<ICity | undefined>(
    undefined
  );
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleCountryChange = (countryCode: string) => {
    const selectedStates = State.getStatesOfCountry(countryCode);
    setSelectedCountry(Country.getCountryByCode(countryCode));
    setStates(selectedStates);
    setCities([]);
    setSelectedState(undefined);
    setSelectedCity(undefined);
  };

  const handleStateChange = (stateCode: string) => {
    if (!selectedCountry) return;
    setSelectedState(
      State.getStateByCodeAndCountry(stateCode, selectedCountry.isoCode)
    );
    const selectedCities = City.getCitiesOfState(
      selectedCountry?.isoCode,
      stateCode
    );
    setCities(selectedCities);
    setSelectedCity(undefined);
  };

  const handleCityChange = (city: ICity) => {
    setSelectedCity(city);
  };

  const handleSubmit = async () => {
    const selectedLocation = selectedCity ?? selectedState ?? selectedCountry;
    if (
      !selectedLocation ||
      !selectedLocation.latitude ||
      !selectedLocation.longitude
    ) {
      console.error("Selected location does not have latitude/longitude");
      return;
    }
    if (!selectedLocation) {
      console.error("No location selected");
      return;
    }
    setIsLoading(true);
    const res = await fetchData(
      selectedLocation.longitude,
      selectedLocation.latitude,
      selectedLocation.name
    );
    console.log("Response from fetchData:", res);
    router.push(`/plan/${res.id}`);
  };

  async function fetchData(
    longitude: string,
    latitude: string,
    location_name: string
  ) {
    const data = await fetch("/api/packing-lists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude,
        longitude,
        location_name,
      }),
    });
    const res = await data.json();
    return res;
  }

  return (
    <div className="container mx-auto min-h-[80vh] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Where to next?</h1>
          <p className="text-muted-foreground text-lg">
            Select your destination and we&apos;ll help you pack for your trip
          </p>
        </div>

        <div className="bg-card border rounded-xl shadow-sm p-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-row w-full justify-between mb-13">
              <div className="space-y-2">
                <LocationCombobox
                  locations={countries}
                  label="Country"
                  onChange={handleCountryChange}
                />
              </div>

              <div className="space-y-2">
                <LocationCombobox
                  locations={states}
                  label="State/Province"
                  disabled={states.length === 0}
                  onChange={handleStateChange}
                />
              </div>

              <div className="space-y-2">
                <LocationCombobox
                  locations={cities}
                  label="City"
                  disabled={cities.length === 0}
                  // @ts-expect-error - City type does not match expected type
                  onChange={handleCityChange}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleSubmit}
                size="lg"
                disabled={isLoading}
                className="min-w-[200px] h-12"
              >
                {isLoading ? (
                  <>
                    Generating List
                    <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Create Packing List
                    <Plane className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
