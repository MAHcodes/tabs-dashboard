import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";

import Button from "components/Button";
import Input from "components/Input";
import IconSelector from "components/IconSelector";
import AppContext from "src/AppContext";

import "./index.scss";
import Backup from "../../components/Backup";
import ImportButton from "../../components/Backup/Import";

const Onboarding = () => {
  const history = useHistory();
  const [step, setStep] = useState(0);
  const {
    newWorkspaceIcon,
    setNewWorkspaceIcon,
    newWorkspaceName,
    setNewWorkspaceName,
    createAndLoadFirstWorkspace,
  } = useContext(AppContext);

  const createAndLoadDashboard = async () => {
    try {
      await createAndLoadFirstWorkspace();
      history.push("/");
    } catch (err) {
      toast.error("Unable to create your first workspace. please try again");
    }
  };

  const nextStep = () => {
    if (step === 1 && !newWorkspaceName) {
      toast.error("Please enter workspace name");
    } else {
      setStep(step + 1);
    }
  };

  const renderStep1 = () => {
    return (
      <div className="welcome-block">
        <img className="logo" src="/assets/icons/icon500.png" />
        <div className="title">Welcome to Fire Dashboard</div>
        <div className="sub-title">
          Your personal browser new tab dashboard with multiple workspaces
        </div>

        <ImportButton
          size="large"
          outline
          iconLeft="ri-file-upload-line"
          className="gap"
        >
          Restore a backup file
        </ImportButton>

        <div style={{ marginBlock: "1rem" }}>OR</div>

        <Button
          size="large"
          onClick={nextStep}
          iconLeft="ri-arrow-right-s-line"
          className="invert gap"
        >
          Continue
        </Button>
      </div>
    );
  };

  const renderStep2 = () => {
    return (
      <div className="welcome-block">
        <div className="title">Create your first workspace</div>
        <div className="workspace-basic">
          <IconSelector
            selectedIcon={newWorkspaceIcon}
            setSelectedIcon={setNewWorkspaceIcon}
          />
          <Input
            placeholder="Workspace Name"
            value={newWorkspaceName}
            onChangeValue={setNewWorkspaceName}
          />
        </div>
        <Button size="large" onClick={createAndLoadDashboard}>
          Next
        </Button>
      </div>
    );
  };

  const stepRenderer = [renderStep1, renderStep2];

  return <div className="onboarding-wrapper">{stepRenderer[step]()}</div>;
};

export default Onboarding;
