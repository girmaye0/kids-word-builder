import React, { useState, useRef, useEffect } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel"; // Assuming TextInputWithLabel is used, not WordInputWithLabel unless you created it
import styles from "./WordListItem.module.css"; // Corrected module name to WordListItem.module.css
import checkbox from "../../assets/checkbox.png"; // Assuming checkbox image is still used

function WordListItem({
  word,
  toggleWordLearnedStatus,
  onUpdateWord,
  onDeleteWord,
}) {
  // Renamed props
  const [isEditing, setIsEditing] = useState(false);
  const [workingWord, setWorkingWord] = useState(word.fields.Word); // Access word.fields.Word
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setWorkingWord(word.fields.Word); // Update workingWord if word.fields.Word prop changes
  }, [word.fields.Word]);

  const handleEditChange = (event) => {
    // Renamed handleEdit to handleEditChange for clarity
    setWorkingWord(event.target.value);
  };

  const handleUpdate = () => {
    if (isEditing && workingWord.trim() && workingWord !== word.fields.Word) {
      // Compare with word.fields.Word
      onUpdateWord({
        // Use onUpdateWord prop
        id: word.id,
        Word: workingWord.trim(), // Use 'Word' field name
        IsLearned: word.fields.IsLearned, // Use 'IsLearned' field name
      });
      setIsEditing(false);
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setWorkingWord(word.fields.Word); // Revert to original word.fields.Word
    setIsEditing(false);
  };

  return (
    <li className={styles.wordItem}>
      {" "}
      {/* Changed class from todoListItem to wordItem */}
      {isEditing ? (
        <div className={styles.editContainer}>
          {" "}
          {/* Apply CSS Module style */}
          <TextInputWithLabel
            label="Word" // Changed label to "Word"
            value={workingWord}
            onChange={handleEditChange} // Use handleEditChange
            ref={editInputRef}
            elementId={`editInput-${word.id}`}
            className={styles.editInput} // Apply CSS Module style
          />
          <button
            type="button"
            onClick={handleUpdate}
            className={styles.saveButton}
          >
            {" "}
            {/* Apply CSS Module style */}
            Update
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
          >
            {" "}
            {/* Apply CSS Module style */}
            Cancel
          </button>
        </div>
      ) : (
        <div className={styles.displayContainer}>
          {" "}
          {/* Apply CSS Module style */}
          <label className={styles.label}>
            {" "}
            {/* Apply CSS Module style */}
            <img
              src={checkbox}
              alt={word.fields.IsLearned ? "Learned" : "Not Learned"} // Alt text for accessibility
              className={styles.checkboxImage} // Apply CSS Module style
              onClick={() => toggleWordLearnedStatus(word.id)} // Use toggleWordLearnedStatus
            />
            <input
              type="checkbox"
              id={`checkbox${word.id}`}
              checked={word.fields.IsLearned} // Access word.fields.IsLearned
              onChange={() => toggleWordLearnedStatus(word.id)} // Use toggleWordLearnedStatus
              className={styles.hiddenCheckbox} // Style to hide native checkbox if using image
            />
          </label>
          <span
            className={
              word.fields.IsLearned
                ? styles.completedWordTitle
                : styles.wordTitle // Apply CSS Module styles, use 'Word'
            }
            onClick={() => setIsEditing(true)}
          >
            {word.fields.Word} {/* Access word.fields.Word */}
          </span>
          <button
            type="button"
            onClick={() => onDeleteWord(word.id)}
            className={styles.deleteButton}
          >
            {" "}
            {/* Use onDeleteWord */}
            Delete
          </button>
        </div>
      )}
    </li>
  );
}

export default WordListItem;
