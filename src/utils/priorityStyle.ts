import type { Priority } from "../types/task";

export const priorityStyleMap: Record<
  Priority,
  { label: string; color: string }
> = {
  High: {
    label: "HIGH",
    color: "#ff6b6b",
  },
  Medium: {
    label: "MEDIUM",
    color: "#feca57",
  },
  Low: {
    label: "LOW",
    color: "#1dd1a1",
  },
};
