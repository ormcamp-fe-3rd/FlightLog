export const BREAKPOINTS = {
  DESKTOP: 1024,
  TABLET: 744,
  MOBILE: 375,
} as const;

export const PAGES = [
  { id: "map", title: "Map", icon: "/images/common/icon-map.svg" },
  { id: "log", title: "LogPage", icon: "/images/common/icon-pie-chart.svg" },
] as const;

export const CONTROL_BUTTONS = [
  {
    id: "flightInfo",
    icon: "/images/map/icon-control-info.svg",
    label: "Flight info",
    iconClassName: "size-7",
  },
  {
    id: "attitude",
    icon: "/images/map/icon-control-attitude.svg",
    label: "Attitude",
    iconClassName: "size-7",
  },
  {
    id: "zoom",
    icon: "/images/map/icon-control-zoom.svg",
    label: "Zoom",
    iconClassName: "size-7 p-1",
  },
] as const;

export const TELEMETRY_MSGID = {
  POSITION: 33,
  GPS: 24,
  SPEED: 74,
  ATTITUDE: 30,
  BATTERY: 147,
  STATUS: 253,
} as const;

export const CONVERSION_FACTORS = {
  LAT_LON: 1e-7,
  ALTITUDE: 1e-3,
  HEADING: 1e-2,
} as const;

export const PLAY_SPEED = [1, 2, 5, 10, 30];
