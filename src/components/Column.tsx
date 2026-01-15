import type { Status, Task } from "../types/task";
import TaskCard from "./TaskCard";

interface Props {
  title: string;
  status: Status;
  tasks: Task[];
}

const Column = ({ title, status, tasks }: Props) => {
  const filteredTasks = tasks.filter((task) => task.status === status);

  return (
    <div className="w-80 bg-gray-200 rounded-xl p-4">
      <h3 className="text-center font-bold mb-4">{title}</h3>

      <div className="flex flex-col gap-3">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Column;
