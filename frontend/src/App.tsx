import { Board } from "./components/Board";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-900 px-6 py-4 text-white">
        <h1 className="text-xl font-bold">Trello風タスク管理</h1>
      </header>
      <Board />
    </div>
  );
}

export default App;
