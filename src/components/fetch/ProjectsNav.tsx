import { Tooltip } from "@mui/material";
import React from "react";
import HttpsTwoToneIcon from "@mui/icons-material/HttpsTwoTone";

import { IProject } from "types/gitInterfaces";

import "./ProjectsNav.scss";

interface IProjectsNavProps {
  project: IProject;
  projects: IProject[];
  activateProject: (project: IProject) => void;
}

const ProjectsNav: React.FC<IProjectsNavProps> = ({
  project,
  projects,
  activateProject,
}): JSX.Element => {
  return (
    <div className="projects-nav">
      <div className="projects-nav-projects">
        {projects.map((p, i) => (
          <Tooltip
            key={i}
            title={`${p.unlocked ? "" : `unlocks on day ${p.unlockDay}`}`}
            placement="top-start"
          >
            <div
              key={i}
              onClick={() => p.unlocked && activateProject(p)}
              className={`projects-nav-projects-project ${
                p.type === project.type ? "active" : !p.unlocked ? "locked" : ""
              }`}
            >
              {p.unlocked && p.type}
              {!p.unlocked && <HttpsTwoToneIcon />}
            </div>
          </Tooltip>
        ))}
      </div>
      <div className="projects-nav-stats">
        <div className="projects-nav-stats-stat">
          Cash: x{project.stats.cashMultiplier}
        </div>
        <div className="projects-nav-stats-stat">
          Time: x{project.stats.timeReduction}
        </div>
      </div>
    </div>
  );
};

export default ProjectsNav;
