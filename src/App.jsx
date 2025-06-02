import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { styled } from "styled-components";
import { NoteState } from "./atoms/atom";
import Note from "./components/Note";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import useSaveToLocalStorage from "./hooks/useSaveToLocalStorage";
import { useEffect } from "react";

const DROPPABLE_ID = "note-list";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 60px;
  padding: 40px;
`;
const FormCreateNote = styled.form`
  display: flex;
  gap: 16px;
  width: 100%;
`;
const InputText = styled.input.attrs({ type: "text" })`
  padding: 8px;
  width: 100%;
  height: 40px;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.$error ? "red" : "black")};
`;
const Button = styled.button.attrs({ type: "submit" })`
  flex: 1;
`;
const ErrorText = styled.p`
  color: red;
  font-size: 14px;
`;
const NotesWrapper = styled.section`
  overflow: auto;
  display: flex;
  flex-direction: row;
  gap: 40px;
  flex-wrap: nowrap;
  align-items: flex-start;
  width: 100%;
`;

function App() {
  const [noteState, setNoteState] = useRecoilState(NoteState);
  const saveNoteState = useSaveToLocalStorage("noteState");
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    saveNoteState(noteState);
  }, [noteState, saveNoteState]);

  const createNote = (data) => {
    const newNote = data.NewNote.trim();
    if (noteState.data[newNote]) {
      setError("NewNote", {
        type: "duplicate",
        message: `"${newNote}"는 이미 존재하는 노트입니다.`,
      });
      return;
    }
    // new
    setNoteState((prev) => {
      const newNoteState = {
        order: [...prev.order, newNote],
        data: {
          ...prev.data,
          [newNote]: [],
        },
      };
      return newNoteState;
    });
    setValue("NewNote", ""); //reset
  };
  const onDragEnd = (info) => {
    const { source, destination } = info;
    //draggableId -> 처음 선택한것
    //source.droppableId -> 드래그하던 note container
    //source.index -> 옮기려고하는 위치
    //destination.droppableId -> 옮기려고하는 위치
    if (!destination) return;
    if (source.droppableId === destination.droppableId) {
      //only same note
      setNoteState((prev) => {
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
      //other note
      setNoteState((prev) => {
        const newData = { ...prev.data };
        const copySourceItems = [...newData[source.droppableId]];
        const copyDestinationItems = [...newData[destination.droppableId]];
        const [movedItem] = copySourceItems.splice(source.index, 1);
        copyDestinationItems.splice(destination.index, 0, movedItem);
        newData[source.droppableId] = copySourceItems;
        newData[destination.droppableId] = copyDestinationItems;
        return {
          ...prev,
          data: newData,
        };
      });
    }
  };

  return (
    <Wrapper>
      {/* Form */}
      <FormCreateNote onSubmit={handleSubmit(createNote)}>
        <InputText {...register("NewNote", { required: "노트 이름을 입력해주세요" })} placeholder="Create Note" $error={errors.NewNote} />
        <Button>Add</Button>
      </FormCreateNote>
      {/* Error */}
      {errors.NewNote && <ErrorText>{errors.NewNote.message}</ErrorText>}
      {/* Note */}
      {noteState.order.length > 0 ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <NotesWrapper>
            {noteState.order.map((title) => (
              <Note key={title} title={title} note={noteState.data[title]} />
            ))}
          </NotesWrapper>
        </DragDropContext>
      ) : (
        "노트를 추가해주세요."
      )}
    </Wrapper>
  );
}

export default App;
