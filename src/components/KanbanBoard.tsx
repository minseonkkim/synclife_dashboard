import { useEffect, useState } from "react";
import type { Task, Priority } from "../types/task";
import Column from "./Column";
import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");

  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const [recentKeywords, setRecentKeywords] = useState<string[]>(() => {
    const stored = localStorage.getItem("recent_keywords");
    return stored ? JSON.parse(stored) : [];
  });

  /* 검색 디바운싱 (필터용) */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  /* 최근 검색어 저장 */
  const saveRecentKeyword = (keyword: string) => {
    if (!keyword.trim()) return;

    setRecentKeywords((prev) => {
      const updated = [keyword, ...prev.filter((k) => k !== keyword)].slice(
        0,
        5
      );

      localStorage.setItem("recent_keywords", JSON.stringify(updated));
      return updated;
    });
  };

  const removeRecentKeyword = (keyword: string) => {
    setRecentKeywords((prev) => {
      const updated = prev.filter((k) => k !== keyword);
      localStorage.setItem("recent_keywords", JSON.stringify(updated));
      return updated;
    });
  };

  /* 검색 필터 */
  const filteredTasks =
    debouncedKeyword.trim() === ""
      ? tasks
      : tasks.filter((task) =>
          task.title.toLowerCase().includes(debouncedKeyword.toLowerCase())
        );

  /* Task 추가 */
  const handleAddTask = () => {
    if (!title.trim()) return;

    onAddTask({ title, description, priority });
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setShowModal(false);
  };

  /* 드래그 앤 드롭 */
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    onMoveTask(Number(draggableId), destination.droppableId as Task["status"]);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="w-full max-w-6xl mx-auto py-2 md:py-6">
        {/* 🔍 검색창 */}
        <div className="flex justify-center items-center gap-2 mb-3 mx-4 md:mx-0">
          <input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveRecentKeyword(searchKeyword);
                setDebouncedKeyword(searchKeyword);
              }
            }}
            onBlur={() => {
              saveRecentKeyword(searchKeyword);
              setDebouncedKeyword(searchKeyword);
            }}
            placeholder="Task 제목 검색"
            className="
              w-full h-10 md:w-[400px]
              px-4 py-2 rounded border
              bg-white text-gray-900 placeholder-gray-400
              dark:bg-gray-900 dark:text-white dark:placeholder-gray-400
              dark:border-gray-700
              focus:outline-none focus:ring-2
              focus:ring-black dark:focus:ring-white
            "
          />

          {searchKeyword && (
            <button
              onClick={() => {
                setSearchKeyword("");
                setDebouncedKeyword("");
              }}
              className="
                h-10 px-3 py-2 text-sm rounded border whitespace-nowrap
                bg-white text-gray-700 hover:bg-gray-100
                dark:bg-gray-900 dark:text-gray-200
                dark:border-gray-700 dark:hover:bg-gray-800
              "
            >
              초기화
            </button>
          )}
        </div>

        {/* 최근 검색어 */}
        {recentKeywords.length > 0 && (
          <div className="flex justify-center gap-2 mb-4 flex-wrap">
            {recentKeywords.map((keyword) => (
              <div
                key={keyword}
                className="
                  flex items-center gap-1 px-3 py-1 text-xs
                  rounded-full border
                  bg-white text-black
                  dark:bg-gray-800 dark:text-white dark:border-gray-700
                "
              >
                <button
                  onClick={() => {
                    setSearchKeyword(keyword);
                    setDebouncedKeyword(keyword);
                  }}
                  className="hover:underline"
                >
                  {keyword}
                </button>
                <button
                  onClick={() => removeRecentKeyword(keyword)}
                  className="text-gray-400 hover:text-black dark:hover:text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 태스크 추가 버튼 */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-5 py-3 rounded-full shadow-lg hover:opacity-80"
          >
            + 새 Task 추가
          </button>
        </div>

        {/* 컬럼 */}
        <div className="flex flex-col md:flex-row md:gap-2 lg:gap-6 justify-center">
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
