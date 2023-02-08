import { ThemeProvider, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CloudDownloadTwoToneIcon from "@mui/icons-material/CloudDownloadTwoTone";

import { theme } from "styles/muiThemes";
import { IProject, IRemoteBranch } from "types/gitInterfaces";
import { useFirstRender } from "hooks/useFirstRender";
import InfoText from "components/InfoText";
import Background from "components/Background";
import ProjectsNav from "components/fetch/ProjectsNav";
import RemoteBranch from "components/fetch/RemoteBranch";

import "./FetchScreen.scss";
import { RotatingLines } from "react-loader-spinner";
import HighlightText from "components/HighlightText";

interface IFetchScreenProps {
  project: IProject;
  projects: IProject[];
  displayBranches: IRemoteBranch[];
  isFirstDay: boolean;
  terminalController: JSX.Element;
  goBack: () => void;
  activateProject: (project: IProject) => void;
}

const FetchScreen: React.FC<IFetchScreenProps> = ({
  project,
  projects,
  displayBranches,
  isFirstDay,
  terminalController,
  goBack,
  activateProject,
}): JSX.Element => {
  const firstRender = useFirstRender();
  const [isCloning, setIsCloning] = useState<boolean>(false);
  const [textCopied, setTextCopied] = useState<boolean>(false);
  const [prevProject, setPrevProject] = useState<string>(project.type);

  const copyProjectUrl = () => {
    navigator.clipboard.writeText(project.url);
    setTextCopied(true);
    setTimeout(() => {
      setTextCopied(false);
    }, 1500);
  };

  useEffect(() => {
    if (project.type !== prevProject) setPrevProject(project.type);
  }, [project.type]);

  useEffect(() => {
    let timeId: NodeJS.Timeout | null = null;

    if (project.cloned && !firstRender && project.type === prevProject) {
      setIsCloning(true);
      timeId = setTimeout(() => {
        setIsCloning(false);
      }, 3000);
    }

    return () => {
      if (timeId) clearTimeout(timeId);
    };
  }, [project.cloned]);

  return (
    <Background>
      <div className="fetch-screen">
        <div className="fetch-screen-projects">
          <ProjectsNav
            project={project}
            projects={projects}
            activateProject={activateProject}
          />
        </div>
        <div className="fetch-screen-content">
          {!project.cloned ? (
            <div className="fetch-screen-content-info">
              <div className="fetch-screen-content-info-content">
                <CloudDownloadTwoToneIcon />
                <div className="fetch-screen-content-info-content-url">
                  <h1>Project URL</h1>
                  <div className="fetch-screen-content-info-content-url-text">
                    <p>{project.url}</p>
                    <ContentCopyOutlinedIcon onClick={() => copyProjectUrl()} />
                  </div>
                  {textCopied && (
                    <div className="fetch-screen-content-info-content-url-copied">
                      Copied!
                    </div>
                  )}
                </div>
              </div>
              <div className="fetch-screen-content-info-text">
                <InfoText text="You have not cloned this project yet. Use %git clone <PROJECT_URL>% to connect to this project" />
              </div>
            </div>
          ) : isCloning ? (
            <div className="fetch-screen-content-cloning">
              <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="96"
                visible={true}
              />
              <HighlightText
                text={`Cloning %${project.type}% project to your computer...`}
              />
            </div>
          ) : !isCloning && displayBranches.length > 0 ? (
            <>
              <div className="fetch-screen-content-branches">
                {displayBranches.map((rb, i) => (
                  <RemoteBranch key={i} branch={rb} />
                ))}
              </div>
              <div className="fetch-screen-content-text">
                <InfoText text="Navaigate to the restaurant you want with %git checkout <branch>% to start your day" />
              </div>
            </>
          ) : (
            <div className="fetch-screen-content-info">
              <div className="fetch-screen-content-info-content">
                <CloudDownloadTwoToneIcon />
                <p>Waiting for fetch ...</p>
              </div>
              <div className="fetch-screen-content-info-text">
                <InfoText text="A new day is about to start! Fetch today's orders with %git fetch% and get started " />
              </div>
            </div>
          )}
        </div>
        <div className="fetch-screen-terminal">{terminalController}</div>
        {!isFirstDay && (
          <div className="fetch-screen-return" onClick={() => goBack()}>
            <ThemeProvider theme={theme}>
              <Tooltip title={"Shop"}>
                <ArrowBackIcon className="fetch-screen-return-button" />
              </Tooltip>
            </ThemeProvider>
          </div>
        )}
      </div>
    </Background>
  );
};

export default FetchScreen;
