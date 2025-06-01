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

  const onDragEnd = ({ source, destination }) => {
    if (!destination || source.index === destination.index) return;
    setNoteState((prev) => {
      const newOrder = Array.from(prev.order);
      const [moved] = newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, moved);
      return {
        ...prev,
        order: newOrder,
      };
    });
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
          <Droppable droppableId={DROPPABLE_ID} direction="horizontal" disableInteractiveElementBlocking={true}>
            {(provided) => (
              <NotesWrapper ref={provided.innerRef} {...provided.droppableProps}>
                {noteState.order.map((title, index) => (
                  <Draggable key={title} draggableId={title} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <Note title={title} note={noteState.data[title]} dragHandleProps={provided.dragHandleProps} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </NotesWrapper>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        "노트를 추가해주세요."
      )}
    </Wrapper>
  );
}

export default App;
