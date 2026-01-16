import { useEffect, useState } from "react";
import KanbanBoard from "./components/KanbanBoard";
import { sampleTasks } from "./data/sampleTasks";
import type { Task } from "./types/task";
import Header from "./components/Header";

const STORAGE_KEY = "kanban_tasks";

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : sampleTasks;
  });

  const [darkMode, setDarkMode] = useState(false);

  /* 다크모드 로컬 스토리지 반영 */
  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored) setDarkMode(stored === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

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
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex items-center justify-center">
          <KanbanBoard
            tasks={tasks}
            onAddTask={addTask}
            onMoveTask={moveTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
