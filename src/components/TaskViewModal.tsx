import type { Task } from "../types/task";

interface TaskViewModalProps {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
}

const TaskViewModal = ({ task, onClose, onEdit }: TaskViewModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">태스크 상세</h2>

        <div className="space-y-3 text-sm">
          <div>
            <span className="font-semibold">제목</span>
            <p>{task.title}</p>
          </div>

          {task.description && (
            <div>
              <span className="font-semibold">설명</span>
              <p className="text-gray-600">{task.description}</p>
            </div>
          )}

          <div className="flex gap-6">
            <div>
              <span className="font-semibold">우선순위</span>
              <p>{task.priority}</p>
            </div>
            <div>
              <span className="font-semibold">상태</span>
              <p>{task.status}</p>
            </div>
          </div>

          <div className="text-xs text-gray-400">
            {new Date(task.updatedAt || task.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm border rounded"
          >
            닫기
          </button>
          <button
            onClick={onEdit}
            className="px-3 py-1.5 text-sm bg-black text-white rounded"
          >
            수정
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskViewModal;
