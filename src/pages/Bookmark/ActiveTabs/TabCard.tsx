import React, { useContext } from "react";
import Button from "components/Button";

import BookmarkContext from "../BookmarkContext";

const TabCard = ({ tabId }): JSX.Element => {
  const { tabData } = useContext(BookmarkContext);

  const handleCloseTab = () => {
    console.log("fire");
    chrome.tabs.remove(tabId);
  }

  const data = tabData[tabId] || {};

  return (
    <div className="active-list-item">
      {data.favIconUrl ? (
        <img className="fav-img" src={data.favIconUrl} />
      ) : (
        <i className="ri-window-line fav-img fav-img-icon" />
      )}
      <span className="tab-title">{data.title}</span>
      <Button
        size="xs"
        title="Close Tab"
        type="button"
        className="close-btn"
        onClick={handleCloseTab}>
        <i className="icon ri-close-fill" />
      </Button>
    </div>
  );
};

export default TabCard;
