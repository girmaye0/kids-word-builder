import React, { useState, useRef, useEffect } from "react";
import WordInputWithLabel from "../../shared/WordInputWithLabel";
import styles from "./WordListItem.module.css";
import { FaVolumeUp } from "react-icons/fa";

function WordListItem({
  word,
  toggleWordLearnedStatus,
  onUpdateWord,
  onDeleteWord,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingWord, setWorkingWord] = useState(word.Word);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setWorkingWord(word.Word);
  }, [word.Word]);

  const handleEditChange = (event) => {
    setWorkingWord(event.target.value);
  };

  const handleUpdate = () => {
    if (isEditing && workingWord.trim() && workingWord !== word.Word) {
      onUpdateWord({
        id: word.id,
        Word: workingWord.trim(),
        IsLearned: word.IsLearned,
      });
      setIsEditing(false);
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setWorkingWord(word.Word);
    setIsEditing(false);
  };

  const speakWord = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech synthesis not supported in this browser.");
    }
  };

  return (
    <li className={styles.wordItem}>
      {isEditing ? (
        <div className={styles.editContainer}>
          <WordInputWithLabel
            label="Word"
            value={workingWord}
            onChange={handleEditChange}
            ref={editInputRef}
            elementId={`editInput-${word.id}`}
            className={styles.editInput}
          />
          <button
            type="button"
            onClick={handleUpdate}
            className={styles.saveButton}
          >
            Update
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className={styles.displayContainer}>
          <label className={styles.label}>
            <input
              type="checkbox"
              id={`checkbox${word.id}`}
              checked={word.IsLearned}
              onChange={() => toggleWordLearnedStatus(word.id)}
              className={styles.checkbox}
            />
          </label>
          <span
            className={
              word.IsLearned ? styles.completedWordTitle : styles.wordTitle
            }
            onClick={() => setIsEditing(true)}
          >
            {word.Word}
          </span>
          <FaVolumeUp
            className={styles.speakerIcon}
            onClick={() => speakWord(word.Word)}
            title="Pronounce word"
          />
          <button
            type="button"
            onClick={() => onDeleteWord(word.id)}
            className={styles.deleteButton}
          >
            Delete
          </button>
        </div>
      )}
    </li>
  );
}

export default WordListItem;
