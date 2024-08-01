import React from 'react';
import { ButtonContainer, FilgreeContainer } from "./styled";

const Button = ({ variant, size, filgree, children, onClick }) => (
  <ButtonContainer variant={variant} size={size} onClick={onClick}>
    <span />
    <p>{children}</p>
    {filgree && <FilgreeContainer />}
  </ButtonContainer>
);

export default Button;
