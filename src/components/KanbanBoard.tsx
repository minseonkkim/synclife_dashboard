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

  /* 디바운싱 (300ms) */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  /* 최근 검색어 저장 (디바운싱 완료 후) */
  useEffect(() => {
    if (!debouncedKeyword.trim()) return;

    setRecentKeywords((prev) => {
      const updated = [
        debouncedKeyword,
        ...prev.filter((k) => k !== debouncedKeyword),
      ].slice(0, 5);

      localStorage.setItem("recent_keywords", JSON.stringify(updated));
      return updated;
    });
  }, [debouncedKeyword]);

  /* 최근 검색어 삭제 */
  const removeRecentKeyword = (keyword: string) => {
    setRecentKeywords((prev) => {
      const updated = prev.filter((k) => k !== keyword);
      localStorage.setItem("recent_keywords", JSON.stringify(updated));
      return updated;
    });
  };

  /* 검색 필터링 (검색어 없으면 전체) */
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

  /* 드래그앤 드롭 */
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    onMoveTask(Number(draggableId), destination.droppableId as Task["status"]);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="w-full max-w-6xl mx-auto py-2 md:py-6">
        {/* 검색창 */}
        <div className="flex flex-row justify-center items-center gap-2 mb-3 mx-4 md:mx-0">
          <input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Task 제목 검색"
            className="w-full h-10 md:w-[400px] px-4 py-2 border rounded"
          />
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword("")}
              className="h-10 px-3 py-2 text-sm border rounded hover:bg-gray-100 whitespace-nowrap"
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
                className="flex items-center gap-1 px-3 py-1 text-xs border rounded-full bg-white"
              >
                <button
                  onClick={() => setSearchKeyword(keyword)}
                  className="hover:underline"
                >
                  {keyword}
                </button>
                <button
                  onClick={() => removeRecentKeyword(keyword)}
                  className="text-gray-400 hover:text-black"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 추가 버튼 */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white text-sm px-5 py-3 rounded-full shadow-lg hover:opacity-80"
          >
            + 새 Task 추가
          </button>
        </div>

        {/* 추가 모달 */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-2">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
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

        {/* 칸반 컬럼 */}
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
