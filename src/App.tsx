import { useEffect, useState } from "react";
import KanbanBoard from "./components/KanbanBoard";
import { sampleTasks } from "./data/sampleTasks";
import type { Task, Priority } from "./types/task";

const STORAGE_KEY = "kanban_tasks";

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : sampleTasks;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask: Omit<Task, "id" | "createdAt" | "status">) => {
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: "TODO",
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <KanbanBoard tasks={tasks} onAddTask={addTask} />
    </div>
  );
}

export default App;
