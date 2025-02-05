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
  BATTERY_REMAINING: 1e-2,
  TEMPERATURE: 1e-2,
  RAD_TO_DEG: 180 / Math.PI,
  ALT_ELLIPSOID: 1e-2,
} as const;

export const PLAY_SPEED = [1, 2, 5, 10, 30];

export const TIMELINE = {
  HEIGHT: 4,
  GAP: 1,
} as const;

export const INITIAL_POSITION = { LAT: 37.566381, LNG: 126.977717 } as const;

export const MAX_DURATION = {
  HOURS: 24,
  MILLISECONDS: 24 * 60 * 60 * 1000,
} as const;
