import { Droppable } from "@hello-pangea/dnd";
import type { Task, Status } from "../types/task";
import TaskCard from "./TaskCard";

interface ColumnProps {
  title: string;
  status: Status;
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
  searchKeyword: string;
}

const Column = ({
  title,
  status,
  tasks,
  onUpdateTask,
  onDeleteTask,
  searchKeyword,
}: ColumnProps) => {
  const filtered = tasks.filter((task) => task.status === status);

  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`
            w-full md:w-80
            md:min-h-[500px] rounded-lg p-4 
            transition-colors
            ${snapshot.isDraggingOver ? "bg-gray-200" : "bg-gray-100"}
          `}
        >
          <h3 className="font-bold mb-4 text-center md:text-left">{title}</h3>

          <div className="flex flex-col gap-3">
            {filtered.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
                highlight={searchKeyword}
              />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default Column;
