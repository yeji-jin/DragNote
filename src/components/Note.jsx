import React from "react";
import { useSetRecoilState } from "recoil";
import { NoteState } from "../atoms/atom";
import { styled } from "styled-components";
import { useForm } from "react-hook-form";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Input, FormCreate, Button, ErrorText, BasicButton } from "../styled/commonStyle";
import { FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaDeleteLeft } from "react-icons/fa6";
import { IoMdAddCircle } from "react-icons/io";

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
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
`;
const NoteBody = styled.ul`
  margin-top: 20px;
  flex: 1;
`;
const Title = styled.h5`
  margin-bottom: 16px;
  font-size: 20px;
  line-height: 1.4;
  font-weight: 700;
`;
const BtnGroup = styled.div`
  display: flex;
  gap: 4px;
`;
const NoteItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 4px;
  background-color: ${(props) => (props.$isDragging ? "#0ca7fa" : "transparent")};
  color: ${(props) => (props.$isDragging ? "#fff" : "#000")};
  font-weight: ${(props) => (props.$isDragging ? 700 : 400)};
  font-size: ${(props) => (props.$isDragging ? "20px" : "16px")};
  border-radius: 4px;
  & ${BasicButton} {
    position: static;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    border: none;
  }
`;
const ListAddContainer = styled.div`
  padding-top: 20px;
  border-top: 1px solid ${(props) => props.theme.backgroundColor};
`;
export default function Notes({ title, note }) {
  const setNoteState = useSetRecoilState(NoteState);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm();
  const createList = (data) => {
    const newList = data.NewList.trim();
    if (!newList) {
      setError("NewList", {
        type: "error",
        message: `텍스트를 입력해주세요.`,
      });
      return;
    }
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
  const deleteNote = () => {
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
  const renameNote = (title) => {
    const newName = window.prompt(`${title} 보드의 새 이름을 입력해주세요.`, title)?.trim();
    if (!newName || newName === title) return;
    setNoteState((prev) => {
      const newData = { ...prev.data };
      const newOrder = [...prev.order];
      newData[newName] = newData[title];
      delete newData[title];

      const index = newOrder.indexOf(title);
      if (index !== -1) {
        newOrder[index] = newName;
      }
      return {
        data: newData,
        order: newOrder,
      };
    });
  };

  const deleteNoteItem = (index) => {
    setNoteState((prev) => {
      const newList = [...prev.data[title]];
      newList.splice(index, 1);
      return {
        ...prev,
        data: { ...prev.data, [title]: newList },
      };
    });
  };
  const renameNoteItem = (index, text) => {
    const newItemName = window.prompt(`${text}의 새 이름을 입력해주세요`, text)?.trim();
    if (newItemName) {
      setNoteState((prev) => {
        const newData = { ...prev.data };
        const updatedList = [...newData[title]];
        updatedList[index] = newItemName;
        newData[title] = updatedList;

        return {
          ...prev,
          data: newData,
        };
      });
    }
  };

  return (
    <NoteContainer>
      <NoteContents>
        <NoteHeader>
          <Title>📒 {title}</Title>
          <BtnGroup>
            <BasicButton onClick={() => renameNote(title)}>
              <FaPen />
            </BasicButton>
            <BasicButton onClick={deleteNote}>
              <MdDelete />
            </BasicButton>
          </BtnGroup>
        </NoteHeader>
        <Droppable droppableId={title}>
          {(provided) => (
            <NoteBody ref={provided.innerRef} {...provided.droppableProps}>
              {note.map((list, index) => (
                <Draggable key={list} draggableId={`${list}`} index={index}>
                  {(provided, snapshot) => (
                    <NoteItem ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} $isDragging={snapshot.isDragging}>
                      <span>
                        {index + 1}. {list}
                      </span>
                      <BtnGroup>
                        <BasicButton onClick={() => renameNoteItem(index, list)}>
                          <FaPen />
                        </BasicButton>
                        <BasicButton onClick={() => deleteNoteItem(index)}>
                          <FaDeleteLeft color="#ff3232" />
                        </BasicButton>
                      </BtnGroup>
                    </NoteItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </NoteBody>
          )}
        </Droppable>
      </NoteContents>
      {/* add list */}
      <ListAddContainer>
        <FormCreate onSubmit={handleSubmit(createList)}>
          <Input placeholder="리스트 추가" {...register("NewList")} $height="14px" />
          <BasicButton>
            <IoMdAddCircle />
          </BasicButton>
        </FormCreate>
        {/* Error */}
        {errors.NewList && <ErrorText $margin="6px 0 0">{errors.NewList.message}</ErrorText>}
      </ListAddContainer>
    </NoteContainer>
  );
}
