import React, { forwardRef } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex: 1; /* Allow this container to take available space */
`;

const StyledLabel = styled.label`
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0;
  margin-right: 8px;
  width: auto;
`;

const StyledInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  flex: 1;
  width: 0; /* Important for flex items with flex-grow to shrink properly */
  min-width: 0;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const WordInputWithLabel = forwardRef(
  ({ elementId, label, value, onChange, className, ...props }, ref) => {
    return (
      <Container {...props}>
        <StyledLabel htmlFor={elementId}>{label}</StyledLabel>
        <StyledInput
          type="text"
          id={elementId}
          value={value}
          onChange={onChange}
          ref={ref}
          className={className}
        />
      </Container>
    );
  }
);

WordInputWithLabel.displayName = "WordInputWithLabel";

export default WordInputWithLabel;
