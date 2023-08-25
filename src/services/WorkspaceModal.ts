import BaseModal from "./BaseModel";

class WorkspaceModal extends BaseModal {
  constructor() {
    super();

    this.modalName = "workspace";
  }

  add(data) {
    return super.add({
      settings: {},
      collectionKey: `${data.name.replace(/ /g, "-")}-${this.getUniqId()}`,
      ...data,
    });
  }

  getInitialValues() {
    return {
      name: "",
      icon: "ri-user-line",
      settings: {
        general: {
          defaultApp: "BOOKMARK",
          color: "color-1",
        },
        bookmark: {
          openInNewTab: true,
          closeTabAutomatically: false,
        },
      },
    };
  }
}

export default new WorkspaceModal();
