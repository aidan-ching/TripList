"use client";

import { LocationCombobox } from "@/components/LocationComboboxes/LocationCombobox";

import { useState } from "react";
import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";

export default function Plan() {
  const countries = Country.getAllCountries();
  const [selectedCountry, setSelectedCountry] = useState<ICountry | undefined>(
    undefined
  );
  const [selectedState, setSelectedState] = useState<IState | undefined>(
    undefined
  );
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const handleCountryChange = (countryCode: string) => {
    const selectedStates = State.getStatesOfCountry(countryCode);
    setSelectedCountry(Country.getCountryByCode(countryCode));
    setStates(selectedStates);
    setCities([]);
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
  };

  const handleSubmit = () => {
    console.log("Selected Country:", selectedCountry);
    console.log("Selected States:", selectedState);
    console.log("Selected Cities:", cities);

    //need a usestate for the date as well
  };

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
        />
        <DateRangePicker />
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
