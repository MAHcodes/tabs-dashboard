import { initializeApp } from "firebase/app";

import {
  initializeFirestore,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { localGet, localSet } from "utils/chromeStorage";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
}

class FirebaseService {
  constructor() {
    this.db = null;
  }

  getDb() {
    return this.db;
  }

  async getConfig(config) {
    const projectId = config
      ? config.projectId
      : await localGet("firebaseProjectId");
    const apiKey = config ? config.apiKey : await localGet("firebaseApiKey");

    return {
      projectId: projectId || "",
      apiKey: apiKey || "",
    };
  }

  async setConfig(config) {
    await localSet({
      firebaseProjectId: config.projectId,
      firebaseApiKey: config.apiKey,
    });
  }

  async init() {
    const localConfig = await this.getConfig();

    if (localConfig.apiKey && localConfig.projectId) {
      const firebaseConfig: FirebaseConfig = {
        apiKey: localConfig.apiKey,
        authDomain: `${localConfig.projectId}.firebaseapp.com`,
        projectId: localConfig.projectId,
      };

      const firebaseApp = initializeApp(firebaseConfig);

      this.db = initializeFirestore(firebaseApp, {});
    }
  }

  async test(config) {
    const localConfig = await this.getConfig(config);

    const firebaseConfig: FirebaseConfig = {
      apiKey: localConfig.apiKey,
      authDomain: `${localConfig.projectId}.firebaseapp.com`,
      projectId: localConfig.projectId,
    };

    try {
      const firebaseApp = initializeApp(firebaseConfig);

      const db = initializeFirestore(firebaseApp, {});

      const response = await addDoc(collection(db, "test-fire-dashboard-app"), {
        hello: "world",
      });
      await deleteDoc(response);
    } catch (e) {
      return Promise.reject();
    }
  }

  async hasBackup(config) {
    const localConfig = await this.getConfig(config);

    const firebaseConfig: FirebaseConfig = {
      apiKey: localConfig.apiKey,
      authDomain: `${localConfig.projectId}.firebaseapp.com`,
      projectId: localConfig.projectId,
    };

    try {
      const firebaseApp = initializeApp(firebaseConfig);

      const db = initializeFirestore(firebaseApp, {});

      const querySnapshot = await getDocs(
        query(
          collection(db, "workspace_workspace"),
          where("isDeleted", "==", 0),
        ),
      );

      const workspaces = [];

      querySnapshot.forEach((doc) => workspaces.push(doc.data()));

      return !!workspaces.length;
    } catch (e) {
      return Promise.reject();
    }
  }

  async deleteAllWorkspace(config) {
    const localConfig = await this.getConfig(config);

    const firebaseConfig: FirebaseConfig = {
      apiKey: localConfig.apiKey,
      authDomain: `${localConfig.projectId}.firebaseapp.com`,
      projectId: localConfig.projectId,
    };

    try {
      const firebaseApp = initializeApp(firebaseConfig);

      const db = initializeFirestore(firebaseApp, {});

      const querySnapshot = await getDocs(
        query(
          collection(db, "workspace_workspace"),
          where("isDeleted", "==", 0),
        ),
      );

      querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, { isDeleted: 1 });
      });
    } catch (e) {
      return Promise.reject();
    }
  }
}

export default new FirebaseService();
