import React, { useState, useRef } from "react";
import styled from "styled-components";
import TextInputWithLabel from "../shared/TextInputWithLabel"; // Changed from WordInputWithLabel back to TextInputWithLabel as per available artifacts

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-bottom: 10px;
  margin-bottom: 20px;
  width: 100%;
`;

const StyledButton = styled.button`
  padding: 10px 10px;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
  margin-left: 8px;

  &:hover {
    background-color: #367c39;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    font-style: italic;
  }
`;

const StyledInputAndButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%; /* Ensure this container takes full width */
`;

function WordForm({ onAddWord, isSaving }) {
  // Renamed onAddTodo to onAddWord
  const [newWord, setNewWord] = useState(""); // Renamed title to newWord
  const wordInputRef = useRef(null); // Renamed todoTitleInput to wordInputRef

  const handleInputChange = (event) => {
    setNewWord(event.target.value); // Use setNewWord
  };

  const handleAddWord = (event) => {
    // Renamed handleAddTodo to handleAddWord
    event.preventDefault();
    if (newWord.trim()) {
      // Use newWord
      onAddWord(newWord.trim()); // Use onAddWord, newWord
      setNewWord(""); // Use setNewWord
      wordInputRef.current.focus(); // Use wordInputRef
    }
  };

  return (
    <StyledForm onSubmit={handleAddWord}>
      {" "}
      {/* Use handleAddWord */}
      <StyledInputAndButtonContainer>
        <TextInputWithLabel
          elementId="wordTitle" // Renamed elementId to wordTitle
          label="Word" // Renamed label to Word
          value={newWord} // Use newWord
          ref={wordInputRef} // Use wordInputRef
          onChange={handleInputChange}
          style={{
            flex: 1,
          }}
        />
        <StyledButton
          type="submit"
          disabled={newWord.trim() === "" || isSaving} // Use newWord
        >
          {isSaving ? "Adding..." : "Add Word"} {/* Updated button text */}
        </StyledButton>
      </StyledInputAndButtonContainer>
    </StyledForm>
  );
}

export default WordForm;
