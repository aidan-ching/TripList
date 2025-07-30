"use client";

import { LocationCombobox } from "@/components/LocationComboboxes/LocationCombobox";

import { useState } from "react";
import { useRouter } from 'next/navigation'
import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";

import { DateRange } from "react-day-picker";

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

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

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
    if (!selectedLocation) {
      console.error("No location selected");
      return;
    }
    const res = await fetchData(
      // @ts-expect-error stuff
      selectedLocation.longitude,
      selectedLocation.latitude
    );
    console.log("Response from fetchData:", res);
     router.push(`/plan/${res.id}`)
  };

  const handleDateUpdate = (values: {
    range: DateRange;
    rangeCompare?: DateRange;
  }) => {
    const { range } = values;
    setDateRange(range);
  };

  async function fetchData(longitude: string, latitude: string) {
    const selectedLocation = selectedCity ?? selectedState ?? selectedCountry;
    if (
      !selectedLocation ||
      !selectedLocation.latitude ||
      !selectedLocation.longitude
    ) {
      console.error("Selected location does not have latitude/longitude");
      return;
    }

    const data = await fetch("/api/packing-lists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude,
        longitude,
      }),
    });
    const res = await data.json();
    return res;
  }

  return (
    <div className="w-screen flex flex-col items-center gap-5 ">
      <div className="text-3xl font-semibold">Where to next?</div>
      <div className="flex flex-row gap-5">
        <LocationCombobox
          locations={countries}
          label="country"
          onChange={handleCountryChange}
        />

        <LocationCombobox
          locations={states}
          label="state"
          disabled={states.length === 0}
          onChange={handleStateChange}
        />

        <LocationCombobox
          locations={cities}
          label="city"
          disabled={cities.length === 0}
          onChange={handleCityChange}
        />
        
      </div>

      <Button
        onClick={handleSubmit}
        className="mt-16 flex flex-row items-center"
        size="lg"
      >
        Submit <Plane />
      </Button>
    </div>
  );
}
