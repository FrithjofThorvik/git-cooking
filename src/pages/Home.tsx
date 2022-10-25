import React from "react";
import Sidebar from "../components/sidebars/StartSidebar";

import "./Home.scss";

const Home: React.FC = (): JSX.Element => {
  return (
    <div className="home">
      <Sidebar />
    </div>
  );
};

export default Home;
