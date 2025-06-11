import React from "react";
import WordListItem from "./WordListItem";
import styles from "./WordList.module.css"; // Corrected import to WordList.module.css

function WordList({
  wordList,
  toggleWordLearnedStatus,
  onUpdateWord,
  onDeleteWord,
  isLoading,
}) {
  return (
    <>
      {isLoading ? (
        <p>Word list loading...</p>
      ) : wordList.length === 0 ? (
        <p>No words yet! Add some to get started.</p>
      ) : (
        <ul className={styles.wordList}>
          {" "}
          {/* Changed class name from todoList to wordList */}
          {wordList.map((word) => (
            <WordListItem
              key={word.id}
              word={word}
              toggleWordLearnedStatus={toggleWordLearnedStatus}
              onUpdateWord={onUpdateWord}
              onDeleteWord={onDeleteWord}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default WordList;
