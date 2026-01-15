import type { Task, Priority } from "../types/task";
import { useState } from "react";

interface TaskEditModalProps {
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => void;
}

export const TaskEditModal = ({
  task,
  onClose,
  onSave,
}: TaskEditModalProps) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState<Priority>(task.priority);

  const handleSave = () => {
    onSave({
      ...task,
      title,
      description,
      priority,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">태스크 수정</h2>

        <input
          className="w-full border rounded px-3 py-2 mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border rounded px-3 py-2 mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="설명"
        />

        <select
          className="w-full border rounded px-3 py-2 mb-4"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm border rounded"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-sm bg-black text-white rounded"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};
