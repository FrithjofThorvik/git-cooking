import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Play from "./pages/Play";

import "./App.scss";

const App: React.FC = (): JSX.Element => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Play />} />
      </Routes>
    </div>
  );
};

export default App;
