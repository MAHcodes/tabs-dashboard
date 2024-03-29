import React, { useContext } from "react";

import {
  verticalListSortingStrategy,
  defaultAnimateLayoutChanges,
} from "@dnd-kit/sortable";

import BookmarkContext from "../BookmarkContext";
import GroupCard from "./GroupCard";
import Sortable from "../../../components/DragAndDrop/Sortable";
import { getId } from "../utils";

import "./index.scss";

const animateLayoutChanges = (args) =>
  args.isSorting || args.wasDragging ? defaultAnimateLayoutChanges(args) : true;

const BookmarkCards = ({ isSortingContainer }): JSX.Element => {
  const { data } = useContext(BookmarkContext);

  return (
    <div className="bookmark-cards-wrapper">
      <Sortable
        id="Groups"
        dataList={data.groupIds || []}
        strategy={verticalListSortingStrategy}
      >
        {data.groupIds?.map?.((id) => {
          const { groupId } = getId(id);

          return (
            <Sortable.Item
              key={id}
              id={id}
              componentProps={{
                groupId,
                isSortingContainer,
              }}
              sortableProps={{
                data: {
                  type: "group",
                  groupId,
                },
                animateLayoutChanges,
              }}
              component={GroupCard}
            />
          );
        })}
      </Sortable>
    </div>
  );
};

export default BookmarkCards;
