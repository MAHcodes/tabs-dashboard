import React, { useContext, useState } from "react";
import classNames from "classnames";
import { toast } from "react-toastify";

import PopoverDropdown from "components/PopoverDropdown";
import useChromeTabs from "utils/useChromeTabs";
import useConfirm from "components/Confirm/useConfirm";

import BookmarkContext from "../../BookmarkContext";
import BookmarkEditModal from "../../BookmarkEditModal";

import "./index.scss";

const BookmarkCard = ({
  type,
  tabId,
  bookmarkId,
  isDragComponent,
}): JSX.Element => {
  const { createTabs, updateCurrentTab } = useChromeTabs({
    listnerTabs: false,
  });
  const {
    bookmarks,
    tabData,
    updateBookmarkData,
    enableBulkAction,
    bulkActionIds,
    setBulkActionIds,
    workspace,
  } = useContext(BookmarkContext);
  const { confirm } = useConfirm();
  const [isOpenOptionPopper, setIsOpenOptionPopper] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const isBulkSelected = bulkActionIds.includes(bookmarkId);

  const bookmark =
    type === "tab" ? tabData[tabId] : bookmarks[bookmarkId] || {};

  const toggleEditModal = () => {
    setIsOpenEditModal(!isOpenEditModal);
  };

  const onClickBookmark = (e) => {
    if (enableBulkAction) {
      if (isBulkSelected) {
        setBulkActionIds(bulkActionIds.filter((id) => id !== bookmarkId));
      } else {
        setBulkActionIds((ids) => [...ids, bookmarkId]);
      }
    } else {
      if (e.ctrlKey) {
        createTabs([
          { url: bookmark.url, pinned: bookmark.pinned, active: false },
        ]);
      } else if (workspace?.settings?.bookmark?.openInNewTab) {
        createTabs([
          { url: bookmark.url, pinned: bookmark.pinned, active: true },
        ]);
      } else {
        updateCurrentTab({ url: bookmark.url, pinned: bookmark.pinned });
      }
    }
  };

  const onEdit = async (newData) => {
    try {
      await updateBookmarkData(newData);
      setIsOpenEditModal(false);
    } catch (err) {
      toast.error("Unable to edit bookmark. Please try again");
    }
  };

  const onDelete = async () => {
    const isConfirmed = await confirm({
      message: `Are you sure want to delete this bookmark?`,
    });

    if (isConfirmed) {
      try {
        await updateBookmarkData({
          ...bookmark,
          isDeleted: 1,
        });
      } catch (err) {
        toast.error("Unable to delete bookmark. Please try again");
      }
    }
  };

  const onSelectOption = (option) => {
    if (option.key === "DELETE") {
      onDelete();
    } else if (option.key === "EDIT") {
      toggleEditModal();
    }
  };

  return (
    <>
      <div
        className={classNames("bookmark-card", {
          open: isOpenOptionPopper,
          "bulk-action": enableBulkAction,
          "bulk-selected": isBulkSelected,
        })}
        onClick={onClickBookmark}
      >
        {bookmark.favIconUrl ? (
          <img className="fav-img" src={bookmark.favIconUrl} />
        ) : (
          <i className="ri-window-line fav-img fav-img-icon" />
        )}
        <span className="bookmark-title">{bookmark.title}</span>
        {!isDragComponent && !enableBulkAction ? (
          <PopoverDropdown
            placement="bottom-end"
            isOpen={isOpenOptionPopper}
            setIsOpen={setIsOpenOptionPopper}
            onSelect={onSelectOption}
            options={[
              {
                key: "EDIT",
                icon: "ri-pencil-line",
                label: "Edit",
              },
              {
                key: "LINE",
              },
              {
                key: "DELETE",
                icon: "ri-delete-bin-7-line",
                label: "Delete",
                className: "error-color",
              },
            ]}
          >
            <div className="option-btn">
              <i className="icon ri-arrow-down-s-line" />
            </div>
          </PopoverDropdown>
        ) : null}
      </div>
      <BookmarkEditModal
        isOpen={isOpenEditModal}
        dataToUpdate={bookmark}
        onClose={toggleEditModal}
        onConfirm={onEdit}
      />
    </>
  );
};

export default BookmarkCard;
