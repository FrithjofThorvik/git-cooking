import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Tutorial from "./pages/Tutorial";

import "./App.scss";

const App: React.FC = (): JSX.Element => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tutorial" element={<Tutorial />} />
      </Routes>
    </div>
  );
};

export default App;
