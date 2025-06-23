import React from "react";
import WordList from "../features/WordList/WordList";
import WordForm from "../features/WordForm";
import WordsViewForm from "../features/WordsViewForm.jsx";
import styles from "../App.module.css";
import logo from "../assets/logo.png";
import error from "../assets/error.png";

function WordsPage({
  wordList,
  isLoading,
  errorMessage,
  isSaving,
  sortField,
  sortDirection,
  queryString,
  dispatch,
  handleAddWord,
  updateWord,
  toggleWordLearnedStatus,
  deleteWord,
  handleDismissError,
  wordActions,
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
}) {
  return (
    <>
      {/* <div className={styles.appHeader}>
        <img src={logo} alt="Logo" className={styles.appLogo} />
        <h1>WordWonder</h1>
      </div> */}
      <WordForm onAddWord={handleAddWord} isSaving={isSaving} />
      <WordList
        wordList={wordList}
        toggleWordLearnedStatus={toggleWordLearnedStatus}
        onUpdateWord={updateWord}
        onDeleteWord={deleteWord}
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
      <WordsViewForm
        sortField={sortField}
        setSortField={(value) =>
          dispatch({ type: wordActions.setSortField, field: value })
        }
        sortDirection={sortDirection}
        setSortDirection={(value) =>
          dispatch({ type: wordActions.setSortDirection, direction: value })
        }
        queryString={queryString}
        setQueryStringSetter={(value) =>
          dispatch({ type: wordActions.setQueryString, query: value })
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

export default WordsPage;
