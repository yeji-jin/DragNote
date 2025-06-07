import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./theme/theme.js";
import GlobalStyle from "./styled/GlobalStyle.js";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { styled, keyframes } from "styled-components";
import { NoteState } from "./atoms/atom";
import Note from "./components/Note";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import useSaveToLocalStorage from "./hooks/useSaveToLocalStorage";
import { useEffect, useState } from "react";
import { Input, FormCreate, Button, ErrorText } from "./styled/commonStyle";
import { MdDelete, MdWbSunny } from "react-icons/md";
import { IoMdMoon } from "react-icons/io";
import { FaRegPlusSquare } from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px;
  min-height: 100vh;
`;
const NotesWrapper = styled.section`
  overflow: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-start;
  gap: 40px;
  margin-top: 60px;
  width: 100%;
`;
const TrashWrapper = styled.div`
  overflow: hidden;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  z-index: 10;
  border-radius: 100px 100px 0 0;
`;
const TrashContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  will-change: transform, opacity;
  transition: opacity 0.15s ease-in, transform 0.15s ease-in;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transform: ${(props) => (props.$isVisible ? "translateY(0)" : "translateY(20%)")};
  background: ${(props) => (props.$isDraggingOver ? "#ff1a6a" : "#12b8ff")};
  p {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 24px;
    font-weight: 700;
    color: ${(props) => props.theme.textColor};
  }
`;
const HeaderBtns = styled.div`
  display: flex;
  gap: 2px;
`;
const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  padding: 40px;
  width: 50vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 40px;
  background-color: ${(props) => props.theme.textColor};
  color: ${(props) => props.theme.backgroundColor};
  transition: transform 0.15s ease-in;
  transform: ${(props) => (props.$showPopup ? "translateX(0)" : "translateX(100%)")};
  border-left: 2px solid ${(props) => props.theme.backgroundColor};
  border-radius: 16px 0 0 16px;
  z-index: 99;
  & p:first-child {
    padding-bottom: 24px;
    font-size: 24px;
    border-bottom: 1px solid ${(props) => props.theme.backgroundColor};
  }
  & > button {
    position: absolute;
    top: 30px;
    right: 40px;
    height: 40px;
    background: none;
    border: none;
  }
`;

const TRASH_ID = "TRASH";
function App() {
  const [isDark, setDark] = useState(true);
  const toggleTheme = () => setDark((prev) => !prev);
  const [showPopup, setShowPopup] = useState(false);
  const [noteState, setNoteState] = useRecoilState(NoteState);
  const [trashVisible, setTrashVisible] = useState(false);
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
    setShowPopup(false);
  };
  const onDragStart = () => {
    setTrashVisible(true);
  };
  const onDragEnd = (info) => {
    const { source, destination } = info;
    //draggableId -> 처음 선택한것
    //source.droppableId -> 드래그하던 note container
    //source.index -> 옮기려고하는 위치
    //destination.droppableId -> 옮기려고하는 위치
    if (!destination) {
      setTrashVisible(false);
      return;
    }
    if (destination.droppableId === TRASH_ID) {
      setNoteState((prev) => {
        const newData = { ...prev.data };
        const copy = [...newData[source.droppableId]];
        copy.splice(source.index, 1);
        newData[source.droppableId] = copy;
        return {
          ...prev,
          data: newData,
        };
      });
      return;
    }
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
    setTrashVisible(false);
  };

  return (
    <ThemeProvider theme={!isDark ? lightTheme : darkTheme}>
      <GlobalStyle />
      <Wrapper>
        <HeaderBtns>
          <Button onClick={() => toggleTheme()}>{isDark ? <MdWbSunny /> : <IoMdMoon />}</Button>
          <Button onClick={() => setShowPopup((prev) => !prev)}>{showPopup ? <TiDeleteOutline /> : <FaRegPlusSquare />}</Button>
        </HeaderBtns>
        {/* Form */}
        <ModalWrapper $showPopup={showPopup}>
          <p>생성할 노트를 입력해주세요</p>
          <Button onClick={() => setShowPopup(false)}>
            <TiDeleteOutline size={"40px"} />
          </Button>
          <FormCreate onSubmit={handleSubmit(createNote)}>
            <Input {...register("NewNote", { required: "노트 이름을 입력해주세요" })} placeholder="Create Note" $error={errors.NewNote} />
            <Button>
              <FaRegPlusSquare />
            </Button>
          </FormCreate>
          {/* Error */}
          {errors.NewNote && <ErrorText>{errors.NewNote.message}</ErrorText>}
        </ModalWrapper>
        {/* Note */}
        {noteState.order.length > 0 ? (
          <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <NotesWrapper>
              {noteState.order.map((title) => (
                <Note key={title} title={title} note={noteState.data[title]} />
              ))}
            </NotesWrapper>
            {/* trash */}
            <TrashWrapper>
              <Droppable droppableId={TRASH_ID}>
                {(provided, snapshot) => (
                  <TrashContainer ref={provided.innerRef} {...provided.droppableProps} $isVisible={trashVisible} $isDraggingOver={snapshot.isDraggingOver}>
                    <p>
                      <MdDelete size={26} />
                      이곳에 드래그하면 아이템이 삭제됩니다
                    </p>
                    {provided.placeholder}
                  </TrashContainer>
                )}
              </Droppable>
            </TrashWrapper>
          </DragDropContext>
        ) : (
          "노트를 추가해주세요."
        )}
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
