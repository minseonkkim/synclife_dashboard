import type { Task } from "../types/task";

const priorityClassMap = {
  High: "bg-red-500",
  Medium: "bg-yellow-400 text-black",
  Low: "bg-green-500",
};

const TaskCard = ({ task }: { task: Task }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm transition">
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-semibold">{task.title}</h4>

        <span
          className={`text-[10px] px-2 py-0.5 rounded-full text-white font-bold
            ${priorityClassMap[task.priority]}
          `}
        >
          {task.priority}
        </span>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        {new Date(task.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default TaskCard;
