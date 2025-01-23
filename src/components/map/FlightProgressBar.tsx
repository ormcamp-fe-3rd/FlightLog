"use client";

import calculateCurrentTime from "@/utils/calculateCurrentTime";
import calculateProgressByTimestamp from "@/utils/calculateProgressByTimestamp";
import { useEffect, useRef, useState } from "react";

interface Props {
  progress: number;
  setProgress: (progress: number) => void;
  allTimestamps: number[];
}

export default function FlightProgressBar({
  progress,
  setProgress,
  allTimestamps,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
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

  // 재생 기능
  const handlePlay = (
    timestamps: number[],
    currentProgress: number = progress,
  ) => {
    if (!timestamps || timestamps.length === 0) return null;

    if (intervalId.current) {
      clearInterval(intervalId.current);
      setIsPlaying(false);
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
      <div>
        <div className="flex">
          <button onClick={() => handlePlay(allTimestamps)}>Play</button>
          <button onClick={handlePause}>Pause</button>
          <button onClick={() => setPlaybackSpeed(1)}>X1</button>
          <button onClick={() => setPlaybackSpeed(30)}>X30</button>
          <div>배속: {playbackSpeed}</div>
        </div>
        <div>startTime: {startTime}</div>
        <div>endTime: {endTime}</div>
        <div>currentTime: {currentTime}</div>
      </div>
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
