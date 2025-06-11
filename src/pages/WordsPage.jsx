import React from "react";
import WordList from "../features/WordList/WordList.jsx"; // Updated import
import WordForm from "../features/WordForm.jsx"; // Updated import
import WordsViewForm from "../features/WordsViewForm.jsx"; // Updated import
import styles from "../App.module.css";
import logo from "../assets/logo.png";
import error from "../assets/error.png";

function WordsPage({
  wordList, // Renamed from todoList
  isLoading,
  errorMessage,
  isSaving,
  sortField,
  sortDirection,
  queryString,
  dispatch,
  handleAddWord, // Renamed from handleAddTodo
  updateWord, // Renamed from updateTodo
  toggleWordLearnedStatus, // Renamed from completeTodo
  deleteWord, // Renamed from deleteTodo
  handleDismissError,
  wordsActions, // Renamed from todoActions
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
}) {
  return (
    <>
      <div className={styles.appHeader}>
        {" "}
        {/* Uncommented and updated header */}
        <img src={logo} alt="Logo" className={styles.appLogo} />
        <h1>My Words</h1> {/* Updated title */}
      </div>
      <WordForm onAddWord={handleAddWord} isSaving={isSaving} />{" "}
      {/* Updated component and prop */}
      <WordList // Updated component
        wordList={wordList} // Updated prop
        toggleWordLearnedStatus={toggleWordLearnedStatus} // Updated prop
        onUpdateWord={updateWord} // Updated prop
        onDeleteWord={deleteWord} // Updated prop
        isLoading={isLoading}
      />
      <div className={styles.paginationControls}>
        <button
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>
      <hr className={styles.separator} />
      <WordsViewForm // Updated component
        sortField={sortField}
        setSortField={
          (value) => dispatch({ type: wordsActions.setSortField, field: value }) // Using wordsActions
        }
        sortDirection={sortDirection}
        setSortDirection={
          (value) =>
            dispatch({ type: wordsActions.setSortDirection, direction: value }) // Using wordsActions
        }
        queryString={queryString}
        setQueryStringSetter={
          (value) =>
            dispatch({ type: wordsActions.setQueryString, query: value }) // Using wordsActions
        }
      />
      {errorMessage && (
        <div className={styles.errorContainer}>
          <img src={error} alt="Error Icon" className={styles.errorIcon} />
          <p>{errorMessage}</p>
          <button onClick={handleDismissError}>Dismiss</button>
        </div>
      )}
    </>
  );
}

export default WordsPage; // Changed export name
