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
  /* 상태 */
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");

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

  /* 최근 검색어 */
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

  /* 전체 초기화 */
  const resetAllFilters = () => {
    setSearchKeyword("");
    setDebouncedKeyword("");
    setPriorityFilter("ALL");
    setStatusFilter("ALL");
  };

  /* 필터링 (AND 조건) */
  const filteredTasks = tasks.filter((task) => {
    const keywordMatch =
      debouncedKeyword === "" ||
      task.title.toLowerCase().includes(debouncedKeyword.toLowerCase());

    const priorityMatch =
      priorityFilter === "ALL" || task.priority === priorityFilter;

    const statusMatch = statusFilter === "ALL" || task.status === statusFilter;

    return keywordMatch && priorityMatch && statusMatch;
  });

  /* Task 추가 */
  const handleAddTask = () => {
    if (!title.trim()) return;

    onAddTask({ title, description, priority });
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setShowModal(false);
  };

  /* 드래그 */
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    onMoveTask(Number(draggableId), destination.droppableId as Task["status"]);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        {/* 컨트롤 바 */}
        <div className="mb-6 p-4 rounded-md bg-gray-100 dark:bg-gray-800 shadow-sm flex flex-col gap-3">
          <div className="flex flex-row gap-3 items-center">
            {/* 검색 */}
            <input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveRecentKeyword(searchKeyword);
                  setDebouncedKeyword(searchKeyword);
                }
              }}
              onBlur={() => saveRecentKeyword(searchKeyword)}
              placeholder="Task 제목 검색"
              className="w-full md:flex-1 h-10 px-4 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />

            {/* 우선순위 필터 */}
            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as Priority | "ALL")
              }
              className="h-10 px-4 rounded-md text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none"
            >
              <option value="ALL">우선순위</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* 상태 필터 */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as Task["status"] | "ALL")
              }
              className="h-10 px-4 rounded-md text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none"
            >
              <option value="ALL">상태</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>

            {/* 전체 초기화 버튼 */}
            {(searchKeyword ||
              priorityFilter !== "ALL" ||
              statusFilter !== "ALL") && (
              <button
                onClick={resetAllFilters}
                className="text-xs text-gray-500 hover:text-black dark:hover:text-white"
              >
                초기화
              </button>
            )}
          </div>

          {/* 최근 검색어 */}
          {recentKeywords.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {recentKeywords.map((keyword) => (
                <div
                  key={keyword}
                  className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
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
                    className="opacity-60 hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Task 추가 버튼 */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-6 right-6 z-40 bg-black text-white px-5 py-3 rounded-full shadow-lg hover:opacity-80"
        >
          + 새 Task
        </button>

        {/* 추가 모달 */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-lg font-bold mb-4">새 태스크 추가</h2>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목"
                className="w-full border rounded px-3 py-2 mb-3"
              />

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full border rounded px-3 py-2 mb-3"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="설명 (선택)"
                className="w-full border rounded px-3 py-2 mb-4"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  취소
                </button>
                <button
                  onClick={handleAddTask}
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        )}

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
