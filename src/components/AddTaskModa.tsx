import { useState } from "react";
import type { Priority } from "../types/task";

interface Props {
  open: boolean;
  onClose: () => void;
  onAddTask: (task: {
    title: string;
    description?: string;
    priority: Priority;
  }) => void;
}

const AddTaskModal = ({ open, onClose, onAddTask }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");

  if (!open) return null;

  const submit = () => {
    if (!title.trim()) return;
    onAddTask({ title, description, priority });
    setTitle("");
    setDescription("");
    setPriority("Medium");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-bold mb-4">새 태스크 추가</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose}>취소</button>
          <button onClick={submit}>추가</button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
