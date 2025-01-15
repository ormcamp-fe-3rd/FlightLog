"use client";

import { useState } from "react";

interface Props {
  progress: number;
  setProgress: (value: number) => void;
}

export default function FlightProgressBar({ progress, setProgress }: Props) {
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
        step="0.1"
      />
      <div className="flex w-full justify-between px-2 text-xs">
        {[0, 25, 50, 75, 100].map((mark) => (
          <span
            key={mark}
            className={`marker ${
              progress >= mark ? "text-black" : "text-gray-400"
            }`}
          >
            |
          </span>
        ))}
      </div>
    </>
  );
}
