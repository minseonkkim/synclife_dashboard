import { useEffect, useState } from "react";
import KanbanBoard from "./components/KanbanBoard";
import { sampleTasks } from "./data/sampleTasks";
import type { Task } from "./types/task";

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

  const moveTask = (taskId: number, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const updateTask = (updated: Task) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === updated.id
          ? { ...updated, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <KanbanBoard
        tasks={tasks}
        onAddTask={addTask}
        onMoveTask={moveTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
      />
    </div>
  );
}

export default App;
