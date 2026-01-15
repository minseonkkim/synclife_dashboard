import { useState } from "react";
import type { Task, Priority } from "../types/task";
import Column from "./Column";

interface KanbanBoardProps {
  tasks: Task[];
  onAddTask: (task: {
    title: string;
    description?: string;
    priority: Priority;
  }) => void;
}

const KanbanBoard = ({ tasks, onAddTask }: KanbanBoardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");

  const handleAddTask = () => {
    if (!title.trim()) return;
    onAddTask({ title, description, priority });
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setShowModal(false);
  };

  return (
    <div className="w-full max-w-6xl">
      {/* 추가 버튼 */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white text-sm px-4 py-2 rounded hover:opacity-80"
        >
          + 새 태스크 추가
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
        <Column title="To Do" status="TODO" tasks={tasks} />
        <Column title="In Progress" status="IN_PROGRESS" tasks={tasks} />
        <Column title="Done" status="DONE" tasks={tasks} />
      </div>
    </div>
  );
};

export default KanbanBoard;
