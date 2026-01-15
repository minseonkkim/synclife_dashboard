import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "../types/task";
import { useState } from "react";
import { TaskEditModal } from "./TaskEditModal";
import ConfirmDialog from "./ConfirmDialog";
import { priorityStyleMap } from "../utils/priorityStyle";
import TaskViewModal from "./TaskViewModal";

interface TaskCardProps {
  task: Task;
  index: number;
  onUpdate: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskCard = ({ task, index, onUpdate, onDelete }: TaskCardProps) => {
  const priority = priorityStyleMap[task.priority];

  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <>
      <Draggable draggableId={String(task.id)} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`bg-white p-4 rounded shadow text-sm
              ${snapshot.isDragging ? "shadow-lg rotate-1" : ""}
            `}
          >
            <div className="flex justify-between">
              <h4 className="font-semibold">{task.title}</h4>

              <span
                className="text-[10px] px-2 py-0.5 rounded-full text-white font-bold"
                style={{ backgroundColor: priority.color }}
              >
                {task.priority}
              </span>
            </div>

            <div className="flex gap-2 mt-2 text-xs text-gray-600">
              <button onClick={() => setOpenView(true)}>상세</button>
              <button onClick={() => setOpenEdit(true)}>수정</button>
              <button onClick={() => setOpenDelete(true)}>삭제</button>
            </div>
          </div>
        )}
      </Draggable>

      {openView && (
        <TaskViewModal
          task={task}
          onClose={() => setOpenView(false)}
          onEdit={() => {
            setOpenView(false);
            setOpenEdit(true);
          }}
        />
      )}

      {openEdit && (
        <TaskEditModal
          task={task}
          onClose={() => setOpenEdit(false)}
          onSave={onUpdate}
        />
      )}

      {openDelete && (
        <ConfirmDialog
          message="이 태스크를 삭제하시겠습니까?"
          onConfirm={() => onDelete(task.id)}
          onCancel={() => setOpenDelete(false)}
        />
      )}
    </>
  );
};

export default TaskCard;
