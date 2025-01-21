"use client";

import { formatTimeString } from "@/utils/formatTimestamp";
import { useEffect, useRef, useState } from "react";

interface Props {
  progress: number;
  setProgress: (progress: number) => void;
  timestamp: number[];
}

export default function FlightProgressBar({
  progress,
  setProgress,
  timestamp,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 재생 속도 배율 (1x, 2x 등)
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      handlePlay(timestamp, progress);
    }
  }, [playbackSpeed]);

  // 수동 이동
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(event.target.value);

    if (newProgress >= 0 && newProgress <= 100) {
      if (isPlaying) {
        setProgress(newProgress);
        handlePlay(timestamp, newProgress);
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

  // 시간별 진행도 계산
  const calculateProgressByTimestamp = (
    timestamps: number[],
    currentTime: number,
  ) => {
    if (timestamps.length === 0) return 0;

    const totalDuration = timestamps[timestamps.length - 1] - timestamps[0];
    const elapsed = currentTime - timestamps[0];
    return Math.min((elapsed / totalDuration) * 100, 100);
  };

  // 진행도별 시간 계산
  const calculateCurrentTime = (timestamps: number[], progress: number) => {
    if (!timestamps) return null;
    const totalDuration = timestamps[timestamps.length - 1] - timestamps[0];
    const currentTime = timestamps[0] + (totalDuration * progress) / 100;
    const result = formatTimeString(currentTime);
    return result;
  };

  const startTime = calculateCurrentTime(timestamp, 0);
  const endTime = calculateCurrentTime(timestamp, 100);
  const currentTime = calculateCurrentTime(timestamp, progress);

  return (
    <>
      <div>
        <div className="flex">
          <button onClick={() => handlePlay(timestamp)}>Play</button>
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
