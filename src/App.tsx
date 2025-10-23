import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Resources from "./pages/Resources";

function App() {
  return (
    <div className="text-white p-6 max-w-5xl mx-auto">
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
