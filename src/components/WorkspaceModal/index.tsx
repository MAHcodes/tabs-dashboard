import React, { useContext, useState } from "react";
import _isEqual from "lodash/isEqual";
import { object, string, boolean } from "yup";
import { toast } from "react-toastify";
import classNames from "classnames";

import { useFormik } from "formik";

import Modal from "components/Modal";
import Button from "components/Button";
import Input from "components/Input";
import Switch from "components/Switch";
import FormGroup from "components/FormGroup";
import FormItem from "components/FormItem";
import Tabs from "components/Tabs";
import IconSelector from "components/IconSelector";
import AppContext from "src/AppContext";
import useFormError from "utils/useFormError";
import useConfirm from "components/Confirm/useConfirm";
import WorkspaceService from "services/WorkspaceModal";

import "./index.scss";

const menuItems = [
  {
    value: "GENERAL",
    label: "General",
    icon: "ri-user-settings-line",
  },
  {
    value: "BOOKMARK",
    label: "Bookmark",
    icon: "ri-bookmark-line",
  },
];

const validationSchema = object({
  name: string().required(),
  icon: string().required(),
  settings: object({
    general: object({
      defaultApp: string().required(),
      color: string().required(),
    }),
    bookmark: object({
      openInNewTab: boolean().required(),
    }),
  }),
});

const WorkspaceModal = ({
  dataToEdit,
  onClose,
  showClose,
  onSuccess,
  showHeader,
}) => {
  const { updateWorkspace, setWorkSpace, workspaceList, removeWorkspace } =
    useContext(AppContext);
  const { confirm } = useConfirm();
  const [activeTab, setActiveTab] = useState("GENERAL");
  const { onSubmitForm, showError } = useFormError();

  const onSubmitData = async (dataToSave) => {
    try {
      const response = await updateWorkspace(dataToSave);

      if (!dataToSave.id) {
        setWorkSpace(response);
      }
      if (onSuccess) {
        onSuccess();
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      toast.error("Workspace settings not updated. please try again");
    }
  };

  const onClickDelete = async () => {
    const isConfirmed = await confirm({
      message: "Are you sure want to delete workspace?",
    });

    if (isConfirmed) {
      try {
        await removeWorkspace(dataToEdit);
        toast.success("Workspace deleted successfully");
        if (onSuccess) {
          onSuccess();
        }
        if (onClose) {
          onClose();
        }
      } catch (err) {
        toast.error("Unable to delete this workspace. please try again");
      }
    }
  };

  const formik = useFormik({
    initialValues: dataToEdit || WorkspaceService.getInitialValues(),
    onSubmit: onSubmitData,
    validationSchema,
  });

  const renderGeneral = () => {
    return (
      <>
        <FormItem formKey="settings.general.color" label="Theme">
          {({ onChangeValue, value }) => {
            return (
              <div className="theme-picker">
                {[1, 2, 3, 4, 5, 6, 7].map((index) => (
                  <div
                    key={index}
                    className={classNames(
                      "picker-block",
                      `color-${index}-block`,
                      {
                        active: value === `color-${index}`,
                      },
                    )}
                    onClick={() => onChangeValue(`color-${index}`)}
                  >
                    <i className="icon ri-check-line" />
                  </div>
                ))}
              </div>
            );
          }}
        </FormItem>
      </>
    );
  };

  const renderBookmark = () => {
    return (
      <FormItem
        formKey="settings.bookmark.openInNewTab"
        label="Open url in new tab"
        componentType="switch"
      >
        <Switch />
      </FormItem>
    );
  };

  const rendereds = {
    GENERAL: renderGeneral,
    BOOKMARK: renderBookmark,
  };

  return (
    <>
      {showHeader ? (
        <Modal.Header>{dataToEdit ? "Settings" : "Add Workspace"}</Modal.Header>
      ) : null}
      <Modal.Body className="workspace-modal-wrapper">
        <FormGroup
          values={formik.values}
          errors={formik.errors}
          showError={showError}
          setValue={formik.setFieldValue}
          labelWidth={3}
        >
          <div className="workspace-basic">
            <IconSelector
              selectedIcon={formik.values.icon}
              setSelectedIcon={(val) => formik.setFieldValue("icon", val)}
            />
            <FormItem formKey="name">
              <Input placeholder="Workspace Name" />
            </FormItem>
          </div>
          <div className="setting-body-wrapper">
            <Tabs list={menuItems} value={activeTab} onChange={setActiveTab} />
            {Object.keys(rendereds).map((key) => {
              return (
                <div
                  key={key}
                  className={classNames("setting-body", {
                    active: key === activeTab,
                  })}
                >
                  {rendereds[key]()}
                </div>
              );
            })}
          </div>
        </FormGroup>
      </Modal.Body>
      <Modal.Footer className="space">
        <div className="left">
          {dataToEdit && workspaceList?.length > 1 ? (
            <Button
              iconLeft="ri-delete-bin-7-line"
              type="danger"
              onClick={onClickDelete}
              outline
            >
              Delete
            </Button>
          ) : null}
        </div>
        <div className="right">
          <Button onClick={onSubmitForm(formik.handleSubmit)}>
            {dataToEdit ? "Save" : "Create"}
          </Button>
          {showClose ? (
            <Button type="default" onClick={onClose}>
              Cancel
            </Button>
          ) : null}
        </div>
      </Modal.Footer>
    </>
  );
};

WorkspaceModal.defaultProps = {
  showClose: true,
  showHeader: true,
};

export default WorkspaceModal;
