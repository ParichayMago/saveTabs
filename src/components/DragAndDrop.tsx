import cx from "clsx";
import { Text } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import classes from "../Styles/DndList.module.css";
import { Icontainer, Itabs } from "../App";
import { openUrl } from "../utilities/utility";
import Crossimg from "../../public/Crossicon.png";
import { useEffect } from "react";

export function DndList({ initialData }: { initialData: Itabs[] }) {
  const [state, handlers] = useListState(initialData);

  useEffect(() => {
    handlers.setState(initialData);
  }, [initialData]);

  const removeItems = async (clientId: number, groupId: number) => {
    const updatedState = state.filter((item) => item.client_id !== clientId);
    handlers.setState(updatedState);

    const { grpArr } = (await chrome.storage.local.get("grpArr")) as {
      grpArr: Icontainer[];
    };
    const updatedGrpArr = grpArr.map((container) => {
      if (container.groupId === groupId) {
        return {
          ...container,
          tabData: container.tabData.filter(
            (tab) => tab.client_id !== clientId
          ),
        };
      }
      return container;
    });
    await chrome.storage.local.set({ grpArr: updatedGrpArr });
  };

  const updateAtDragEnd = async (updatedContainerTabData: Itabs[]) => {
    const { grpArr } = (await chrome.storage.local.get("grpArr")) as {
      grpArr: Icontainer[];
    };
    const newUpdatedData = grpArr.map((container) => {
      if (container.groupId === updatedContainerTabData[0].groupId) {
        return {
          ...container,
          tabData: updatedContainerTabData,
        };
      }
      return container;
    });

    await chrome.storage.local.set({ grpArr: newUpdatedData });
  };

  const handleDragEnd = ({ destination, source }: any) => {
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    handlers.reorder({ from: source.index, to: destination.index });

    const reorderedState = [...state];
    const [movedItem] = reorderedState.splice(source.index, 1);
    reorderedState.splice(destination.index, 0, movedItem);

    const updatedTabData = reorderedState.map((item, index) => ({
      ...item,
      index,
    }));

    updateAtDragEnd(updatedTabData);
  };

  const items = state.map((data, index) => (
    <Draggable
      key={data.client_id}
      index={index}
      draggableId={`${data.client_id}`}
    >
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, {
            [classes.itemDragging]: snapshot.isDragging,
          })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className="w-full text-teal-300">
            <div className="cursor-pointer text-xs flex">
              <div className="image self-center">
                <img
                  src={Crossimg}
                  width="30"
                  height="20"
                  onClick={() => removeItems(data.client_id, data.groupId)}
                  alt="Remove"
                />
              </div>
              <div className="mx-1 self-center">
                <img src={data.image} width="20" height="10" />
              </div>
              <div className="flex-col">
                <div onClick={() => openUrl(data.url)}>
                  <Text className="hover:text-teal-500">{data.title}</Text>
                </div>
                <div className="text-gray-400">{data.url}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  ));

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="dnd-list" direction="vertical">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="select-none"
          >
            {items}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default DndList;
