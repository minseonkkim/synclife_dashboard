import type { Priority } from "../types/task";

export const priorityStyleMap: Record<
  Priority,
  { label: string; color: string }
> = {
  High: {
    label: "High",
    color: "#ff6b6b",
  },
  Medium: {
    label: "Medium",
    color: "#feca57",
  },
  Low: {
    label: "Low",
    color: "#1dd1a1",
  },
};
