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
const NoteContents = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
const NoteHeader = styled.header`
  display: flex;
  justify-content: space-between;
`;
const NoteBody = styled.ul`
  flex: 1;
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
  const onDeleteList = (index) => {
    setNoteState((prev) => {
      const newList = [...prev.data[title]];
      newList.splice(index, 1);
      return {
        ...prev,
        data: { ...prev.data, [title]: newList },
      };
    });
  };

  return (
    <NoteContainer>
      <NoteContents>
        <NoteHeader>
          <Title>📒 {title}</Title>
          <DeleteButton onClick={onDeleteNote}>❌</DeleteButton>
        </NoteHeader>
        {note.length > 0 && (
          <Droppable droppableId={title}>
            {(provided) => (
              <NoteBody ref={provided.innerRef} {...provided.droppableProps}>
                {note.map((list, index) => (
                  <Draggable key={list} draggableId={`${list}`} index={index}>
                    {(provided) => (
                      <NoteItem ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <span>
                          {index + 1}. {list}
                        </span>
                        <DeleteButton onClick={() => onDeleteList(index)}>❌</DeleteButton>
                      </NoteItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </NoteBody>
            )}
          </Droppable>
        )}
      </NoteContents>
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
