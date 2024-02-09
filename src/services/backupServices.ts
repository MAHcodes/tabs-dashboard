import Dexie from "dexie";
import { importDB, exportDB } from "dexie-export-import";

export const exportWorkspaces = async () => {
  const dbNames = await Dexie.getDatabaseNames();

  const dbs = {};

  // Open each database and export it
  for (const dbName of dbNames) {
    const db = await new Dexie(dbName).open();
    const dbBlob = await exportDB(db);
    const blob = new Blob([dbBlob], { type: "application/json" });

    // Convert the Blob into a string
    const string = await blob.text();

    // Parse the string into a JSON object
    const json = JSON.parse(string);

    dbs[dbName] = json;
  }

  // Create a JSON string from the object containing the exported databases
  const jsonString = JSON.stringify(dbs);

  // Create a Blob from the JSON string
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create a download link for the file
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "tabs-dashboard.json";
  downloadLink.click();
  URL.revokeObjectURL(downloadLink.href);
};

export const importWorkspaces = (file) => {
  return new Promise((resolve, reject) => {
    file.text()
      .then((jsonString) => {
        const dbs = JSON.parse(jsonString);
        const promises = [];

        for (const dbName in dbs) {
          const dbData = dbs[dbName];
          const jsonString = JSON.stringify(dbData);
          const blob = new Blob([jsonString], { type: "application/json" });

          const importPromise = importDB(blob);
          promises.push(importPromise);
        }

        Promise.all(promises)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
};
