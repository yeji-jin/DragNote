import React from "react";
import { styled } from "styled-components";

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
const NoteItem = styled.li`
  padding: 8px 4px;
  font-size: 16px;
`;
const ListAddContainer = styled.div`
  padding-top: 20px;
  border-top: 1px solid ${(props) => props.theme.backgroundColor};
`;
const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
`;
export default function Notes({ title, note, dragHandleProps }) {
  // console.log("note", note);
  return (
    <NoteContainer {...dragHandleProps}>
      <div>
        <Title>📒 {title}</Title>
        <DeleteButton>❌</DeleteButton>
        {note.length > 0 && (
          <ul>
            {note.map((list, index) => (
              <NoteItem key={index}>
                {index + 1}.{list}
              </NoteItem>
            ))}
          </ul>
        )}
      </div>
      {/* add list */}
      <ListAddContainer>
        <form>
          <input type="text" placeholder="리스트 추가" />
          <button>add</button>
        </form>
      </ListAddContainer>
    </NoteContainer>
  );
}
