import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "../types/task";
import { priorityStyleMap } from "../utils/priorityStyle";

interface TaskCardProps {
  task: Task;
  index: number;
}

const TaskCard = ({ task, index }: TaskCardProps) => {
  const priority = priorityStyleMap[task.priority];
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white p-4 rounded shadow text-sm transition
            ${snapshot.isDragging ? "shadow-lg rotate-1" : ""}
          `}
        >
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-semibold">{task.title}</h4>

            <span
              className="text-[10px] px-2 py-0.5 rounded-full text-white font-bold"
              style={{ backgroundColor: priority.color }}
            >
              {task.priority}
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            {new Date(task.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
