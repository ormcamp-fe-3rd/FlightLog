"use client";

import { PLAY_SPEED } from "@/constants";
import calculateTimeByProgress from "@/utils/calculateTimeByProgress";
import Timeline from "@/components/map/Timeline";
import usePlayback from "@/hooks/usePlayback";
import { TimelineData } from "@/types/types";
import { useEffect, useState } from "react";
import useData from "@/store/useData";

interface Props {
  progress: number;
  setProgress: (progress: number) => void;
  selectedFlight: string;
  setSelectedFlight: (id: string) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
}

export default function FlightProgressBar({
  progress,
  setProgress,
  selectedFlight,
  setSelectedFlight,
  isPlaying,
  setIsPlaying,
}: Props) {
  const { allTimestamps, operationTimestamps } = useData();
  const {
    togglePlay,
    handleInputChange,
    selectFlightAndMoveToStart,
    updateCurrentFlight,
    setPlaybackSpeed,
  } = usePlayback(
    allTimestamps,
    progress,
    setProgress,
    isPlaying,
    setIsPlaying,
  );
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);

  useEffect(() => {
    selectFlightAndMoveToStart(selectedFlight, timelineData, setSelectedFlight);
  }, [selectedFlight]);

  useEffect(() => {
    updateCurrentFlight(selectedFlight, timelineData, setSelectedFlight);
  }, [progress, timelineData]);

  const handleTimelineClick = (id: string) => {
    selectFlightAndMoveToStart(id, timelineData, setSelectedFlight);
  };

  const startTime = calculateTimeByProgress(allTimestamps, 0);
  const endTime = calculateTimeByProgress(allTimestamps, 100);
  const currentTime = calculateTimeByProgress(allTimestamps, progress);

  return (
    <>
      <div className="flex w-full items-end justify-around font-bold md:flex-col md:items-start md:pl-14">
        <span>{currentTime ? `현재 시간: ${currentTime}` : ""}</span>
        <div className="hidden md:flex">
          {startTime && endTime ? `재생 시간: ${startTime} - ${endTime}` : ""}
        </div>
      </div>
      <div className="flex w-full items-center gap-4 font-bold">
        <button
          onClick={togglePlay}
          className="size-10 flex-shrink-0 rounded-full bg-blue-500 text-white hover:bg-blue-600"
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
        <span className="md:hidden">{startTime}</span>
        <div className="w-full">
          <input
            type="range"
            min={0}
            max="100"
            value={progress}
            onChange={handleInputChange}
            className="range"
            step="0.1"
          />
          <Timeline
            allTimestamps={allTimestamps}
            operationTimestamps={operationTimestamps}
            setTimelineData={setTimelineData}
            onTimelineClick={handleTimelineClick}
          />
        </div>
        <span className="md:hidden">{endTime}</span>
        <select
          className="select select-sm w-20"
          onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
        >
          {PLAY_SPEED.map((rate) => (
            <option key={rate} value={rate}>
              {rate}x
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
