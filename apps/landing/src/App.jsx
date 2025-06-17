import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ToolsPage from "./pages/ToolsPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ToolsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
