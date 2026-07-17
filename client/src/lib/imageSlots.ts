export const IMAGE_SLOTS = [
  { key: "home_testband_bg", label: "Home — \"Why we test\" banner background" },
  { key: "home_hero_bg", label: "Home — Hero background" },
  { key: "our_story_hero_bg", label: "Our Story — Hero background" },
] as const;

export type ImageSlotKey = (typeof IMAGE_SLOTS)[number]["key"];
