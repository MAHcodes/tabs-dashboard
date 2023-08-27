import React, { useState } from "react";
import { toast } from "react-toastify";
import Modal from "components/Modal";
import FileUpload from "components/FileUpload";
import { importWorkspaces } from "../../services/backupServices";
import Button from "components/Button";

const ImportButton = ({children, ...props}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleImport = async (files) => {
    importWorkspaces(files[0])
      .then(() => {
        location.reload();
      })
      .catch((e) => {
        toast.error("Import Failed!");
        console.log(e);
      });
  };

  return (
    <>
      <Button
        {...props}
        onClick={() => setIsModalOpen(true)}
      >
        {children}
      </Button>
      {isModalOpen && (
        <Modal open={isModalOpen} onClose={closeModal}>
          <Modal.Header>Upload File</Modal.Header>
          <Modal.Body>
            <div className="setting-body-wrapper">
              <FileUpload onChange={handleImport} accept="application/json" />
            </div>
          </Modal.Body>
          <Modal.Footer />
        </Modal>
      )}
    </>
  );
};

export default ImportButton;
