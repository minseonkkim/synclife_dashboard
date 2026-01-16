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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  const filteredTasks =
    debouncedKeyword.trim() === ""
      ? tasks
      : tasks.filter((task) =>
          task.title.toLowerCase().includes(debouncedKeyword.toLowerCase())
        );

  const handleAddTask = () => {
    if (!title.trim()) return;
    onAddTask({ title, description, priority });
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setShowModal(false);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId) {
      return;
    }

    onMoveTask(Number(draggableId), destination.droppableId as Task["status"]);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="w-full max-w-6xl">
        {/* 검색창 */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Task 제목 검색"
            className="w-72 px-4 py-2 border rounded"
          />

          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword("")}
              className="px-3 py-2 text-sm border rounded hover:bg-gray-100"
            >
              초기화
            </button>
          )}
        </div>

        {/* 추가 버튼 */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white text-sm px-4 py-2 rounded hover:opacity-80"
          >
            + 새 Task 추가
          </button>
        </div>

        {/* 모달 */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">새 태스크 추가</h2>
              <input
                type="text"
                placeholder="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-3"
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full border rounded px-3 py-2 mb-4"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <textarea
                placeholder="설명 (선택)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-3"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded border"
                >
                  취소
                </button>
                <button
                  onClick={handleAddTask}
                  className="px-4 py-2 bg-black text-white rounded hover:opacity-80"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 칸반보드 컬럼 */}
        <div className="flex gap-6 justify-center">
          <Column
            title="To Do"
            status="TODO"
            tasks={filteredTasks}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            searchKeyword={searchKeyword}
          />
          <Column
            title="In Progress"
            status="IN_PROGRESS"
            tasks={filteredTasks}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            searchKeyword={searchKeyword}
          />
          <Column
            title="Done"
            status="DONE"
            tasks={filteredTasks}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            searchKeyword={searchKeyword}
          />
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
