import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { NoteState } from "../atoms/atom";
import { styled } from "styled-components";
import { useForm } from "react-hook-form";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const NoteContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px 20px;
  min-width: 200px;
  min-height: 400px;
  border-radius: 16px;
  background-color: ${(props) => props.theme.textColor};
  color: ${(props) => props.theme.backgroundColor};
`;
const Title = styled.h5`
  margin-bottom: 16px;
  font-size: 20px;
  line-height: 1.4;
  font-weight: 700;
`;
const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
`;
const NoteItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 4px;
  font-size: 16px;
  & ${DeleteButton} {
    position: static;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 8px;
    border: none;
  }
`;
const ListAddContainer = styled.div`
  padding-top: 20px;
  border-top: 1px solid ${(props) => props.theme.backgroundColor};
`;
export default function Notes({ title, note }) {
  const setNoteState = useSetRecoilState(NoteState);
  const { register, handleSubmit, setValue } = useForm();
  const createList = (data) => {
    const newList = data.NewList.trim();
    if (!newList) return;
    setNoteState((prev) => {
      const newData = { ...prev.data };
      newData[title] = [...newData[title], newList];
      return {
        ...prev,
        data: newData,
      };
    });
    setValue("NewList", "");
  };
  const onDeleteNote = () => {
    setNoteState((prev) => {
      const newData = { ...prev.data };
      delete newData[title];
      const newOrder = prev.order.filter((id) => id !== title);
      return {
        order: newOrder,
        data: newData,
      };
    });
  };
  const onDeleteList = () => {
    console.log("onDeleteList");
  };
  // const onDragEnd = (info) => {
  //   console.log(info);
  //   if (!destination) return;
  //   //draggableId -> 처음 선택한것
  //   //source.droppableId -> 드래그하려던 note container
  //   //source.index -> 옮기려고하는 위치
  //   //destination.droppableId -> 옮기려고하는 위치
  //   const {draggableId, source, destination } = info;
  //   setNoteState((prev) => {
  //     const newData = {...prev.data};
  //   })
  // };
  const onDragEnd = (info) => {
    const { source, destination } = info;

    console.log("source.droppableId:", source.droppableId);
    console.log("destination.droppableId:", destination.droppableId);
    if (!destination) return;
    if (source.droppableId === destination.droppableId) {
      //same note
      setNoteState((prev) => {
        console.log("same");
        const newData = { ...prev.data };
        const items = [...newData[source.droppableId]];
        const [movedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, movedItem);
        newData[source.droppableId] = items;
        return {
          ...prev,
          data: newData,
        };
      });
    } else {
      console.log("other");
    }
  };

  return (
    // {...dragHandleProps}
    <NoteContainer>
      <div>
        <Title>📒 {title}</Title>
        <DeleteButton onClick={onDeleteNote}>❌</DeleteButton>
        {note.length > 0 && (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={title}>
              {(provided) => (
                <ul ref={provided.innerRef} {...provided.droppableProps}>
                  {note.map((list, index) => (
                    <Draggable key={list} draggableId={list} index={index}>
                      {(provided) => (
                        <NoteItem ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <span>
                            {index + 1}. {list}
                          </span>
                          <DeleteButton onClick={onDeleteList}>❌</DeleteButton>
                        </NoteItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
      {/* add list */}
      <ListAddContainer>
        <form onSubmit={handleSubmit(createList)}>
          <input type="text" placeholder="리스트 추가" {...register("NewList")} />
          <button>⬆️</button>
        </form>
      </ListAddContainer>
    </NoteContainer>
  );
}
