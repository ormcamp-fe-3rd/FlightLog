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
    </>
  );
}
