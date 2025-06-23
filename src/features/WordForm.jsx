import React, { useState, useRef, useEffect, useCallback } from "react";
import WordInputWithLabel from "../shared/WordInputWithLabel";
import styles from "./WordForm.module.css";

const MERRIAM_WEBSTER_API_KEY = import.meta.env.VITE_MERRIAM_WEBSTER_API_KEY;
const API_BASE_URL =
  "https://www.dictionaryapi.com/api/v3/references/collegiate/json/";

function WordForm({ onAddWord, isSaving }) {
  const [word, setWord] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isCheckingSpelling, setIsCheckingSpelling] = useState(false);
  const wordInputRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  const checkSpellingWithApi = useCallback(
    async (inputWord) => {
      if (!MERRIAM_WEBSTER_API_KEY) {
        setIsValid(false);
        setIsCheckingSpelling(false);
        return false;
      }

      if (!inputWord.trim()) {
        setIsValid(false);
        setIsCheckingSpelling(false);
        return false;
      }

      setIsCheckingSpelling(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}${inputWord.toLowerCase().trim()}?key=${MERRIAM_WEBSTER_API_KEY}`
        );
        if (!response.ok) {
          console.error(
            `Merriam-Webster API Error: ${response.status} - ${response.statusText}`
          );
          setIsValid(false);
          return false;
        }

        const data = await response.json();

        const isWordFound =
          Array.isArray(data) &&
          data.length > 0 &&
          typeof data[0] === "object" &&
          data[0].hasOwnProperty("meta");

        setIsValid(isWordFound);
        return isWordFound;
      } catch (error) {
        console.error(
          "Error checking spelling with Merriam-Webster API:",
          error
        );
        setIsValid(false);
        return false;
      } finally {
        setIsCheckingSpelling(false);
      }
    },
    [MERRIAM_WEBSTER_API_KEY]
  );

  const handleWordChange = (e) => {
    const newWord = e.target.value;
    setWord(newWord);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (newWord.trim().length > 0) {
      debounceTimeoutRef.current = setTimeout(() => {
        checkSpellingWithApi(newWord);
      }, 500);
    } else {
      setIsValid(false);
      setIsCheckingSpelling(false);
    }
  };

  const handleAddWord = (e) => {
    e.preventDefault();
    if (word.trim() && isValid && !isSaving && !isCheckingSpelling) {
      onAddWord(word.trim());
      setWord("");
      setIsValid(false);
      if (wordInputRef.current) {
        wordInputRef.current.focus();
      }
    }
  };

  const inputClassName = `${styles.wordInput} ${
    word.trim() === ""
      ? ""
      : isCheckingSpelling
        ? styles.checkingInput
        : isValid
          ? styles.validInput
          : styles.invalidInput
  }`;

  return (
    <form onSubmit={handleAddWord} className={styles.wordForm}>
      <div className={styles.inputAndButtonContainer}>
        <WordInputWithLabel
          elementId="wordTitle"
          label="Word"
          value={word}
          onChange={handleWordChange}
          ref={wordInputRef}
          className={inputClassName}
          style={{ flex: 1 }}
          disabled={isSaving || isCheckingSpelling}
        />
        <button
          type="submit"
          disabled={
            word.trim() === "" || !isValid || isSaving || isCheckingSpelling
          }
          className={styles.addButton}
        >
          {isSaving
            ? "Adding..."
            : isCheckingSpelling
              ? "Checking..."
              : "Add Word"}
        </button>
      </div>
    </form>
  );
}

export default WordForm;
