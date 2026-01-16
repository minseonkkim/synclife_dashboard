import { useEffect, useState } from "react";
import type { Task, Priority } from "../types/task";
import Column from "./Column";
import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import BoardControls from "./BoardControls";
import AddTaskModal from "./AddTaskModa";

interface KanbanBoardProps {
  tasks: Task[];
  onAddTask: (task: {
    title: string;
    description?: string;
    priority: Priority;
  }) => void;
  onMoveTask: (taskId: number, status: Task["status"]) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
}

const KanbanBoard = ({
  tasks,
  onAddTask,
  onMoveTask,
  onUpdateTask,
  onDeleteTask,
}: KanbanBoardProps) => {
  const [showModal, setShowModal] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const [priorityFilter, setPriorityFilter] = useState<Priority | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<Task["status"] | "ALL">(
    "ALL"
  );

  const [recentKeywords, setRecentKeywords] = useState<string[]>(() => {
    const stored = localStorage.getItem("recent_keywords");
    return stored ? JSON.parse(stored) : [];
  });

  /* 검색 디바운싱 */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  /* 필터링 */
  const filteredTasks = tasks.filter((task) => {
    const keywordMatch =
      debouncedKeyword === "" ||
      task.title.toLowerCase().includes(debouncedKeyword.toLowerCase());

    const priorityMatch =
      priorityFilter === "ALL" || task.priority === priorityFilter;

    const statusMatch = statusFilter === "ALL" || task.status === statusFilter;

    return keywordMatch && priorityMatch && statusMatch;
  });

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    onMoveTask(Number(draggableId), destination.droppableId as Task["status"]);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <BoardControls
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          setDebouncedKeyword={setDebouncedKeyword}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          recentKeywords={recentKeywords}
          setRecentKeywords={setRecentKeywords}
        />

        {/* 추가 버튼 */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-6 right-6 z-40 bg-black text-white px-5 py-3 rounded-full shadow-lg"
        >
          + 새 Task
        </button>

        <AddTaskModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onAddTask={onAddTask}
        />

        {/* 컬럼 */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Column
            title="To Do"
            status="TODO"
            tasks={filteredTasks}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            searchKeyword={debouncedKeyword}
          />
          <Column
            title="In Progress"
            status="IN_PROGRESS"
            tasks={filteredTasks}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            searchKeyword={debouncedKeyword}
          />
          <Column
            title="Done"
            status="DONE"
            tasks={filteredTasks}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            searchKeyword={debouncedKeyword}
          />
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
