import KanbanBoard from "./components/KanbanBoard";
import { sampleTasks } from "./data/sampleTasks";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <KanbanBoard tasks={sampleTasks} />
    </div>
  );
}

export default App;
