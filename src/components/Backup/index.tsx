import React from "react";
import Button from "components/Button";
import { exportWorkspaces } from "../../services/backupServices";
import ImportButton from "./Import";

const Backup = () => {
  return (
    <>
      <Button
        size="small"
        link
        iconLeft="ri-upload-2-line"
        onClick={exportWorkspaces}
      >
        Backup
      </Button>
      <ImportButton
        link
        size="small"
        iconLeft="ri-download-2-line"
      >
        Restore
      </ImportButton>
    </>
  );
};

export default Backup;
