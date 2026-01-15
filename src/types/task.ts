export type Priority = "High" | "Medium" | "Low";
export type Status = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  createdAt: string;
  updatedAt?: string;
}
