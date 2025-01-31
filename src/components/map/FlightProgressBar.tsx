"use client";

import { PLAY_SPEED } from "@/constants";
import calculateCurrentTime from "@/utils/calculateCurrentTime";
import calculateProgressByTimestamp from "@/utils/calculateProgressByTimestamp";
import { useEffect, useRef, useState } from "react";

interface Props {
  progress: number;
  setProgress: (progress: number) => void;
  allTimestamps: number[];
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
}

export default function FlightProgressBar({
  progress,
  setProgress,
  allTimestamps,
  isPlaying,
  setIsPlaying,
}: Props) {
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 재생 속도 배율 (1x, 2x 등)
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      handlePlay(allTimestamps, progress);
    }
  }, [playbackSpeed]);

  // 수동 이동
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(event.target.value);

    if (newProgress >= 0 && newProgress <= 100) {
      if (isPlaying) {
        setProgress(newProgress);
        handlePlay(allTimestamps, newProgress);
      } else {
        setProgress(newProgress);
      }
    }
  };

  // 재생
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    isPlaying ? handlePause() : handlePlay(allTimestamps);
  };

  const handlePlay = (
    timestamps: number[],
    currentProgress: number = progress,
  ) => {
    if (!timestamps || timestamps.length === 0) return null;

    if (intervalId.current) {
      clearInterval(intervalId.current);
      setIsPlaying(true);
    }

    setIsPlaying(true);
    const startTime =
      timestamps[0] +
      ((timestamps[timestamps.length - 1] - timestamps[0]) * currentProgress) /
        100;
    let startPlaybackTime = Date.now();

    intervalId.current = setInterval(() => {
      const elapsedTime = (Date.now() - startPlaybackTime) * playbackSpeed;
      const newTime = startTime + elapsedTime;

      const newProgress = calculateProgressByTimestamp(timestamps, newTime);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(intervalId.current!);
        setIsPlaying(false);
        setProgress(0);
      }
    }, 100); // 업데이트 간격 (100ms)
  };

  const handlePause = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      setIsPlaying(false);
    }
  };

  const startTime = calculateCurrentTime(allTimestamps, 0);
  const endTime = calculateCurrentTime(allTimestamps, 100);
  const currentTime = calculateCurrentTime(allTimestamps, progress);

  return (
    <>
      <div className="flex font-bold">
        <div className="flex w-full justify-around">
          <span>{startTime}</span>
          <span>{currentTime}</span>
          <span>{endTime}</span>
        </div>
      </div>
      <div className="flex w-full items-center gap-4">
        <button
          onClick={togglePlay}
          className="size-10 flex-shrink-0 rounded-full bg-blue-500 text-white hover:bg-blue-600"
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
        <input
          type="range"
          min={0}
          max="100"
          value={progress}
          onChange={handleInputChange}
          className="range"
          step="0.1"
        />
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
