"use client";

import { useState } from "react";

export default function FlightProgressBar() {
  const [progress, setProgress] = useState(50);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(event.target.value));
  };

  return (
    <>
      <input
        type="range"
        min={0}
        max="100"
        value={progress}
        onChange={handleInputChange}
        className="range"
        step="25"
      />
      <div className="flex w-full justify-between px-2 text-xs">
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
      </div>
    </>
  );
}
