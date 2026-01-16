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
  highlight?: string;
}

const TaskCard = ({
  task,
  index,
  onUpdate,
  onDelete,
  highlight,
}: TaskCardProps) => {
  const priority = priorityStyleMap[task.priority];

  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return text;

    const regex = new RegExp(`(${keyword})`, "gi");
    return text.split(regex).map((part, idx) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <mark
          key={idx}
          className="bg-yellow-200 dark:bg-yellow-500/50 rounded px-0.5"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <>
      <Draggable draggableId={String(task.id)} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`bg-white dark:bg-gray-800 p-3 md:p-4 rounded shadow text-sm
              ${snapshot.isDragging ? "shadow-lg rotate-1" : ""}
              text-black dark:text-white
            `}
          >
            <div className="flex flex-row justify-between items-center">
              <h4 className="font-semibold break-words text-sm md:text-base">
                {highlightText(task.title, highlight ?? "")}
              </h4>

              <span
                className="mt-2 md:mt-0 text-[10px] md:text-xs px-2 py-0.5 rounded-full text-white font-bold"
                style={{ backgroundColor: priority.color }}
              >
                {task.priority}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600 dark:text-gray-300">
              <button
                onClick={() => setOpenView(true)}
                className="hover:underline"
              >
                상세
              </button>
              <button
                onClick={() => setOpenEdit(true)}
                className="hover:underline"
              >
                수정
              </button>
              <button
                onClick={() => setOpenDelete(true)}
                className="hover:underline text-red-500 dark:text-red-400"
              >
                삭제
              </button>
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
