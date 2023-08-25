import React, { useContext, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import { toast } from "react-toastify";
import {
  DndContext,
  MouseSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DropAnimation,
  defaultDropAnimation,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import Button from "components/Button";

import CollectionCard from "./CollectionCard";
import BookmarkContext from "../BookmarkContext";
import Sortable from "../../../components/DragAndDrop/Sortable";
import NewGroupModal from "../NewGroupModal";
import { getId } from "../utils";

import "./index.scss";

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
  dragSourceOpacity: 0.5,
};

const Collections = (): JSX.Element => {
  const { createNewGroup, data, updateData } = useContext(BookmarkContext);
  const [activeDrag, setActiveDrag] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const isEmpty = !data?.groupIds?.length;

  const toggleCreateModal = () => {
    setShowCreateModal(!showCreateModal);
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 20,
      },
    }),
  );

  const onClickCreateGroup = async (newData) => {
    try {
      await createNewGroup(newData);
      toggleCreateModal();
    } catch (err) {
      toast.error("Unable to create collection. Please try again");
    }
  };

  const handleDragStart = (dragState) => {
    const { active } = dragState;

    setActiveDrag(active?.data?.current?.groupId);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      updateData("group", {
        ...data,
        groupIds: arrayMove(
          data.groupIds,
          data.groupIds.indexOf(active.id),
          data.groupIds.indexOf(over.id),
        ),
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className={classNames("collection-group-wrapper", { empty: isEmpty })}
      >
        {!isEmpty ? (
          <>
            <div className="group-header">
              <div className="group-header-title">Collections</div>
              <Button outline size="small" onClick={toggleCreateModal}>
                Create
              </Button>
            </div>
            <div className="group-list">
              <Sortable
                id="Uber-CollectionCards"
                dataList={data.groupIds || []}
                strategy={verticalListSortingStrategy}
              >
                {data?.groupIds?.map?.((id) => {
                  const { groupId } = getId(id);

                  return (
                    <Sortable.Item
                      key={id}
                      id={id}
                      componentProps={{
                        groupId,
                      }}
                      sortableProps={{
                        data: {
                          type: "group",
                          groupId,
                        },
                      }}
                      component={CollectionCard}
                    />
                  );
                })}
              </Sortable>
            </div>
          </>
        ) : (
          <div className="empty-block">
            <i className="icon ri-bookmark-3-line" />
            <div className="title">No collections added</div>
            <div className="sub-title">
              Add collections or save the current session and you will see them
              here.
            </div>
            <Button size="large" onClick={toggleCreateModal}>
              Add
            </Button>
          </div>
        )}
      </div>
      {createPortal(
        <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
          {activeDrag ? <CollectionCard groupId={activeDrag} /> : null}
        </DragOverlay>,
        document.body,
      )}
      <NewGroupModal
        isOpen={showCreateModal}
        onConfirm={onClickCreateGroup}
        onClose={toggleCreateModal}
      />
    </DndContext>
  );
};

export default Collections;
