import { styled } from "styled-components";

export const BasicButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: ${(props) => (props.$rounded ? "50%" : "4px")};
  border: 1px solid #beb7b7;
  cursor: pointer;
`;
export const Button = styled(BasicButton).attrs((props) => ({ type: props.type || "submit" }))`
  width: 44px;
  height: 44px;
`;
export const FormCreate = styled.form`
  display: flex;
  gap: 8px;
  width: 100%;
  ${Button} {
    height: 100%;
  }
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
