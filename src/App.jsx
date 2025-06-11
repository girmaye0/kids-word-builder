import React, { useEffect, useCallback, useReducer, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import WordsPage from "./pages/WordsPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import Header from "./shared/Header";
import "./App.css";
import styles from "./App.module.css";

import {
  reducer as wordsReducer,
  actions as wordsActions,
  initialState as initialWordsState,
} from "./reducers/words.reducer";

function App() {
  const [wordState, dispatch] = useReducer(wordsReducer, initialWordsState);
  const [pageTitle, setPageTitle] = useState("");
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    wordList,
    isLoading,
    errorMessage,
    isSaving,
    sortField,
    sortDirection,
    queryString,
  } = wordState;

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const createOptions = useCallback(
    (method, payload) => ({
      method,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),
    [token]
  );

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = "";
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",Word)`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString, url]);

  useEffect(() => {
    const fetchWords = async () => {
      dispatch({ type: wordsActions.fetchWords });
      try {
        const options = {
          method: "GET",
          headers: {
            Authorization: token,
          },
        };
        const resp = await fetch(encodeUrl(), options);
        if (!resp.ok) {
          throw new Error(`HTTP error! Status: ${resp.status}`);
        }
        const { records } = await resp.json();
        dispatch({ type: wordsActions.loadWords, records });
      } catch (error) {
        dispatch({ type: wordsActions.setLoadError, error });
      }
    };
    fetchWords();
  }, [encodeUrl, token]);

  useEffect(() => {
    if (location.pathname === "/") {
      setPageTitle("Word List");
    } else if (location.pathname === "/about") {
      setPageTitle("About");
    } else {
      setPageTitle("Not Found");
    }
  }, [location]);

  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const filteredByQuery = queryString
    ? wordList.filter((word) =>
        word.fields.Word.toLowerCase().includes(queryString.toLowerCase())
      )
    : wordList;

  const sortedWordList = [...filteredByQuery].sort((a, b) => {
    if (sortField === "createdTime") {
      return sortDirection === "asc"
        ? new Date(a.createdTime) - new Date(b.createdTime)
        : new Date(b.createdTime) - new Date(a.createdTime);
    } else if (sortField === "Word") {
      return sortDirection === "asc"
        ? a.fields.Word.localeCompare(b.fields.Word)
        : b.fields.Word.localeCompare(a.fields.Word);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedWordList.length / itemsPerPage);
  const indexOfFirstWord = (currentPage - 1) * itemsPerPage;
  const paginatedAndFilteredWords = sortedWordList.slice(
    indexOfFirstWord,
    indexOfFirstWord + itemsPerPage
  );

  const handlePreviousPage = useCallback(() => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set("page", Math.max(1, currentPage - 1).toString());
      return newParams;
    });
  }, [currentPage, setSearchParams]);

  const handleNextPage = useCallback(() => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set("page", Math.min(totalPages, currentPage + 1).toString());
      return newParams;
    });
  }, [currentPage, totalPages, setSearchParams]);

  useEffect(() => {
    if (
      totalPages > 0 &&
      (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages)
    ) {
      navigate("/");
    }
  }, [currentPage, totalPages, navigate]);

  const handleAddWord = useCallback(
    async (newWordTitle) => {
      const payload = {
        records: [{ fields: { Word: newWordTitle, IsLearned: false } }],
      };
      const options = createOptions("POST", payload);
      const requestUrl = url;

      dispatch({ type: wordsActions.startRequest });
      try {
        const resp = await fetch(requestUrl, options);
        if (!resp.ok) {
          throw new Error(resp.message);
        }
        const { records } = await resp.json();
        dispatch({ type: wordsActions.addWord, record: records[0] });
        setSearchParams((prevParams) => {
          const newParams = new URLSearchParams(prevParams);
          newParams.set(
            "page",
            Math.ceil((wordList.length + 1) / itemsPerPage).toString()
          );
          return newParams;
        });
      } catch (error) {
        console.error("Error adding word:", error);
        dispatch({ type: wordsActions.setLoadError, error });
      } finally {
        dispatch({ type: wordsActions.endRequest });
      }
    },
    [
      createOptions,
      dispatch,
      url,
      wordList.length,
      itemsPerPage,
      setSearchParams,
    ]
  );

  const updateWord = useCallback(
    async (editedWord) => {
      const originalWord = wordList.find((word) => word.id === editedWord.id);
      if (!originalWord) return;

      const payload = {
        records: [
          {
            id: editedWord.id,
            fields: {
              Word: editedWord.Word,
              IsLearned: editedWord.IsLearned,
            },
          },
        ],
      };
      const options = createOptions("PATCH", payload);
      const requestUrl = url;

      dispatch({ type: wordsActions.updateWord, editedWord: editedWord });
      dispatch({ type: wordsActions.startRequest });

      try {
        const resp = await fetch(`${requestUrl}/${editedWord.id}`, options);
        if (!resp.ok) {
          throw new Error(resp.message);
        }
      } catch (error) {
        console.error("Error updating word:", error);
        dispatch({
          type: wordsActions.setLoadError,
          error: new Error(`${error.message}. Reverting word...`),
        });
        dispatch({ type: wordsActions.revertWord, originalWord });
      } finally {
        dispatch({ type: wordsActions.endRequest });
      }
    },
    [createOptions, dispatch, wordList, url]
  );

  const toggleWordLearnedStatus = useCallback(
    async (id) => {
      const originalWord = wordList.find((word) => word.id === id);
      if (!originalWord) return;

      dispatch({ type: wordsActions.toggleLearnedStatus, id });
      dispatch({ type: wordsActions.startRequest });

      const payload = {
        records: [
          { id: id, fields: { IsLearned: !originalWord.fields.IsLearned } },
        ],
      };
      const options = createOptions("PATCH", payload);
      const requestUrl = url;

      try {
        const resp = await fetch(`${requestUrl}/${id}`, options);
        if (!resp.ok) {
          throw new Error(resp.message);
        }
      } catch (error) {
        console.error("Error toggling word learned status:", error);
        dispatch({
          type: wordsActions.setLoadError,
          error: new Error(
            `${error.message}. Reverting word learned status...`
          ),
        });
        dispatch({ type: wordsActions.revertWord, originalWord });
      } finally {
        dispatch({ type: wordsActions.endRequest });
      }
    },
    [createOptions, dispatch, wordList, url]
  );

  const deleteWord = useCallback(
    async (id) => {
      const originalWordListAfterOptimisticDelete = wordList.filter(
        (word) => word.id !== id
      );
      const originalWordItem = wordList.find((word) => word.id === id);

      dispatch({
        type: wordsActions.revertWord,
        originalWords: originalWordListAfterOptimisticDelete,
      });
      dispatch({ type: wordsActions.startRequest });

      const requestUrl = url;

      try {
        const resp = await fetch(`${requestUrl}/${id}`, {
          method: "DELETE",
          headers: { Authorization: token },
        });

        if (!resp.ok) {
          throw new Error(resp.message);
        }
      } catch (error) {
        console.error("Error deleting word:", error);
        dispatch({
          type: wordsActions.setLoadError,
          error: new Error(`${error.message}. Reverting deletion...`),
        });
        dispatch({
          type: wordsActions.revertWord,
          originalWord: originalWordItem,
        });
      } finally {
        dispatch({ type: wordsActions.endRequest });
      }
    },
    [dispatch, wordList, token, url]
  );

  const handleDismissError = useCallback(() => {
    dispatch({ type: wordsActions.clearError });
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <Header title={pageTitle} />

      <Routes>
        <Route
          path="/"
          element={
            <WordsPage
              wordList={paginatedAndFilteredWords}
              isLoading={isLoading}
              errorMessage={errorMessage}
              isSaving={isSaving}
              sortField={sortField}
              sortDirection={sortDirection}
              queryString={queryString}
              dispatch={dispatch}
              handleAddWord={handleAddWord}
              updateWord={updateWord}
              toggleWordLearnedStatus={toggleWordLearnedStatus}
              deleteWord={deleteWord}
              handleDismissError={handleDismissError}
              wordActions={wordsActions}
              currentPage={currentPage}
              totalPages={totalPages}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
            />
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
