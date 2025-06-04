import { styled } from "styled-components";

export const FormCreate = styled.form`
  display: flex;
  gap: 8px;
  width: 100%;
`;
export const Button = styled.button.attrs((props) => ({ type: props.type || "submit" }))`
  flex: 1;
`;
export const BasicButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 26px;
  height: 26px;
  border-radius: ${(props) => (props.$rounded ? "50%" : 0)};
`;
export const ErrorText = styled.p`
  margin: ${(props) => props.$margin || 0};
  color: red;
  font-size: 14px;
`;
export const Input = styled.input.attrs((props) => ({
  type: props.type || "text",
}))`
  padding: 8px;
  width: 100%;
  height: ${(props) => props.$height || "40px"};
  border-radius: 4px;
  border: 1px solid ${(props) => (props.$error ? "red" : "black")};
`;
