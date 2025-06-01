import { atom } from "recoil";

export const themeState = atom({
  key: "themeState",
  default: "light",
});

const getNoteState = () => {
  const initialValue = {
    order: ["a", "b", "c"],
    data: {
      a: ["a", "b", "c"],
      b: [],
      c: [],
    },
    // @
    // noteState = [
    //   { id: "a", items: [...] },
    //   { id: "b", items: [...] },
    //   { id: "c", items: [...] },
    // ];
  };
  try {
    const savedNote = localStorage.getItem("noteState");
    // console.log(savedNote);
    if (savedNote) {
      return JSON.parse(savedNote);
    }
  } catch (error) {
    return initialValue;
  }
  return initialValue;
};
export const NoteState = atom({
  key: "noteState",
  default: getNoteState(),
});
