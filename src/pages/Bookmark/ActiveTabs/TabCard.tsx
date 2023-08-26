import React, { useContext } from "react";
import Button from "components/Button";

import BookmarkContext from "../BookmarkContext";

const TabCard = ({ tabId }): JSX.Element => {
  const { tabData } = useContext(BookmarkContext);

  const data = tabData[tabId] || {};

  const handleCloseTab = (event) => {
    event.stopPropagation()
    chrome.tabs.remove(tabId);
  }

  const handleFocusTab = () => {
    chrome.tabs.highlight({
      tabs: data.index,
    });
  }

  return (
    <div className="active-list-item" onClick={handleFocusTab}>
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
