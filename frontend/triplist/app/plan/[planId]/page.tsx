"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ObjectId } from "mongodb";

export default function PlanId() {
  const { planId } = useParams();
  const [packingList, setPackingList] = useState<{
    itemList: { label: string; checked: boolean };
    context: string;
    userId: ObjectId;
  } | null>(null);

  useEffect(() => {
    if (planId) {
      fetch(`/api/packing-lists/${planId}`)
        .then((res) => res.json())
        .then((data) => setPackingList(data.data[0]))
        .catch(() => setPackingList(null));
    }
  }, [planId]);

  return (
    <div className="w-screen flex flex-col items-center gap-10">
      <h2 className="text-5xl font-medium">Packing List</h2>
      {packingList ? (
        <ul>
          {Array.isArray(packingList.itemList) ? (
            packingList.itemList.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <label>{item.label}</label>
              </li>
            ))
          ) : (<div/>)}
        </ul>
      ) : (
        <p>Loading...</p>
      )}

      <p>{packingList?.context}</p>
    </div>
  );
}
