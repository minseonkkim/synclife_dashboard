import type { Task } from "../types/task";
import Column from "./Column";

const KanbanBoard = ({ tasks }: { tasks: Task[] }) => {
  return (
    <div className="flex gap-6">
      <Column title="To Do" status="TODO" tasks={tasks} />
      <Column title="In Progress" status="IN_PROGRESS" tasks={tasks} />
      <Column title="Done" status="DONE" tasks={tasks} />
    </div>
  );
};

export default KanbanBoard;
