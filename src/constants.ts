export const BREAKPOINTS = {
  DESKTOP: 1024,
  TABLET: 744,
  MOBILE: 375,
} as const;

export const PAGES = [
  { id: "map", title: "Map", icon: "/images/common/icon-map.svg" },
  { id: "log", title: "LogPage", icon: "/images/common/icon-pie-chart.svg" },
] as const;
