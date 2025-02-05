import { TimelineData } from "@/types/types";
import calculateProgressByTimestamp from "@/utils/calculateProgressByTimestamp";
import { useEffect, useRef, useState } from "react";

export default function usePlayback(
  allTimestamps: number[],
  progress: number,
  setProgress: (progress: number) => void,
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    handlePause();
    setProgress(0);
  }, [allTimestamps]);

  useEffect(() => {
    if (isPlaying) {
      handlePlay(allTimestamps, progress);
    }
  }, [playbackSpeed]);

  const handlePlay = (
    timestamps: number[],
    currentProgress: number = progress,
  ) => {
    if (!timestamps || timestamps.length === 0) return;

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

  const togglePlay = () => {
    isPlaying ? handlePause() : handlePlay(allTimestamps);
  };

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

  const handleTimelineClick = (
    id: string,
    timelineData: TimelineData[],
    setSelectedFlight: (id: string) => void,
  ) => {
    const operation = timelineData.find((operation) => operation.id === id);
    const startTime = operation?.start ?? 0;
    const endTime = operation?.end ?? 0;
    const startPoint = calculateProgressByTimestamp(allTimestamps, startTime);
    const endPoint = calculateProgressByTimestamp(allTimestamps, endTime);

    // 선택한 operation의 비행시간인 경우, 패널만 변경
    if (progress >= startPoint && progress <= endPoint) {
      setSelectedFlight(id);
      return;
    }

    // 선택한 operation의 비행시간이 아닌 경우, 재생바 이동 및 패널 변경
    if (isPlaying) {
      setSelectedFlight(id);
      setProgress(startPoint);
      handlePlay(allTimestamps, startPoint);
    } else {
      setSelectedFlight(id);
      setProgress(startPoint);
    }
  };

  const updateCurrentFlight = (
    selectedFlight: string,
    timelineData: TimelineData[],
    setSelectedFlight: (id: string) => void,
  ) => {
    const currentOperations = timelineData.filter((operation) => {
      const startPoint = calculateProgressByTimestamp(
        allTimestamps,
        operation.start,
      );
      const endPoint = calculateProgressByTimestamp(
        allTimestamps,
        operation.end,
      );
      return progress >= startPoint && progress <= endPoint;
    });

    if (
      currentOperations.length > 0 &&
      !currentOperations.some((op) => op.id === selectedFlight)
    ) {
      setSelectedFlight(currentOperations[0].id);
    }
  };

  return {
    progress,
    setProgress,
    isPlaying,
    setPlaybackSpeed,
    togglePlay,
    handleInputChange,
    handleTimelineClick,
    updateCurrentFlight,
  };
}
