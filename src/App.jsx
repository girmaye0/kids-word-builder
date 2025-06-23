import React, { useEffect, useCallback, useReducer, useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  useLocation,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

import WordsPage from "./pages/WordsPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import Header from "./shared/Header";
import AuthForm from "./components/AuthForm";

import "./App.css";
import styles from "./App.module.css";

import {
  reducer as wordsReducer,
  actions as wordsActions,
  initialState as initialWordsState,
} from "./reducers/words.reducer";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [wordState, dispatch] = useReducer(wordsReducer, initialWordsState);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authErrorMessage, setAuthErrorMessage] = useState("");

  const {
    wordList,
    isLoading,
    errorMessage,
    isSaving,
    sortField,
    sortDirection,
    queryString,
  } = wordState;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        console.log("User logged in:", currentUser.email || currentUser.uid);
      } else {
        console.log("User logged out or not authenticated.");
        dispatch({ type: wordsActions.loadWords, records: [] });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchWords = async () => {
      if (authLoading) {
        return;
      }
      if (!user) {
        dispatch({ type: wordsActions.loadWords, records: [] });
        return;
      }

      dispatch({ type: wordsActions.fetchWords });
      try {
        const userWordsCollectionRef = collection(
          db,
          "users",
          user.uid,
          "words"
        );

        let q = userWordsCollectionRef;

        if (sortField) {
          q = query(q, orderBy(sortField, sortDirection));
        }

        const querySnapshot = await getDocs(q);

        const records = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            Word: data.Word || "",
            IsLearned: data.IsLearned || false,
            createdTime: data.createdTime
              ? data.createdTime.toDate().toISOString()
              : new Date().toISOString(),
            ...data,
          };
        });
        console.log("Fetched words from Firestore:", records);
        dispatch({ type: wordsActions.loadWords, records });
      } catch (error) {
        console.error("Error fetching words from Firestore:", error);
        dispatch({
          type: wordsActions.setLoadError,
          error: new Error(`Failed to fetch words: ${error.message}`),
        });
      }
    };
    fetchWords();
  }, [user, authLoading, sortField, sortDirection]);

  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const filteredByQuery = queryString
    ? wordList.filter((word) =>
        word.Word.toLowerCase().includes(queryString.toLowerCase())
      )
    : wordList;

  const sortedWordList = [...filteredByQuery].sort((a, b) => {
    if (sortField === "createdTime") {
      const dateA = new Date(a.createdTime);
      const dateB = new Date(b.createdTime);
      const isValidA = !isNaN(dateA.getTime());
      const isValidB = !isNaN(dateB.getTime());

      if (!isValidA && !isValidB) return 0;
      if (!isValidA) return sortDirection === "asc" ? 1 : -1;
      if (!isValidB) return sortDirection === "asc" ? -1 : 1;

      return sortDirection === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    } else if (sortField === "Word") {
      return sortDirection === "asc"
        ? a.Word.localeCompare(b.Word)
        : b.Word.localeCompare(a.Word);
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

  const handleLogin = useCallback(async (email, password) => {
    try {
      setAuthErrorMessage("");
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully!");
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error.message);
      setAuthErrorMessage(error.message);
      return { success: false, error: error.message };
    }
  }, []);

  const handleSignup = useCallback(async (email, password) => {
    try {
      setAuthErrorMessage("");
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up successfully!");
      return { success: true };
    } catch (error) {
      console.error("Signup failed:", error.message);
      setAuthErrorMessage(error.message);
      return { success: false, error: error.message };
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      console.log("User logged out.");
      setAuthErrorMessage("");
    } catch (error) {
      console.error("Logout failed:", error.message);
      setAuthErrorMessage(error.message);
    }
  }, []);

  const handleDismissAuthError = useCallback(() => {
    setAuthErrorMessage("");
  }, []);

  const handleAddWord = useCallback(
    async (newWordTitle) => {
      if (!user) {
        setAuthErrorMessage("Please log in to add words.");
        return;
      }
      dispatch({ type: wordsActions.startRequest });
      try {
        const docRef = await addDoc(
          collection(db, "users", user.uid, "words"),
          {
            Word: newWordTitle,
            IsLearned: false,
            createdTime: new Date(),
            userId: user.uid,
          }
        );
        console.log("Word added to Firestore with ID:", docRef.id);
        dispatch({
          type: wordsActions.addWord,
          record: {
            id: docRef.id,
            Word: newWordTitle,
            IsLearned: false,
            createdTime: new Date().toISOString(),
            userId: user.uid,
          },
        });
        setSearchParams((prevParams) => {
          const newParams = new URLSearchParams(prevParams);
          newParams.set(
            "page",
            Math.ceil((wordList.length + 1) / itemsPerPage).toString()
          );
          return newParams;
        });
      } catch (error) {
        console.error("Error adding word to Firestore:", error);
        dispatch({
          type: wordsActions.setLoadError,
          error: new Error(`Failed to add word: ${error.message}`),
        });
      } finally {
        dispatch({ type: wordsActions.endRequest });
      }
    },
    [dispatch, user, wordList.length, itemsPerPage, setSearchParams]
  );

  const updateWord = useCallback(
    async (editedWord) => {
      if (!user) {
        setAuthErrorMessage("Please log in to update words.");
        return;
      }
      const originalWord = wordList.find((word) => word.id === editedWord.id);
      if (!originalWord) {
        console.warn(
          "Update Word - Original word not found for ID:",
          editedWord.id
        );
        return;
      }

      dispatch({ type: wordsActions.updateWord, editedWord: editedWord });
      dispatch({ type: wordsActions.startRequest });

      try {
        await updateDoc(doc(db, "users", user.uid, "words", editedWord.id), {
          Word: editedWord.Word,
          IsLearned: editedWord.IsLearned,
        });
        console.log("Word updated in Firestore for ID:", editedWord.id);
      } catch (error) {
        console.error("Error updating word in Firestore:", error);
        dispatch({
          type: wordsActions.setLoadError,
          error: new Error(
            `Failed to update word: ${error.message}. Reverting...`
          ),
        });
        dispatch({ type: wordsActions.revertWord, originalWord });
      } finally {
        dispatch({ type: wordsActions.endRequest });
      }
    },
    [dispatch, user, wordList]
  );

  const toggleWordLearnedStatus = useCallback(
    async (id) => {
      if (!user) {
        setAuthErrorMessage("Please log in to update words.");
        return;
      }
      const originalWord = wordList.find((word) => word.id === id);
      if (!originalWord) {
        console.warn(
          "Toggle Learned Status - Original word not found for ID:",
          id
        );
        return;
      }

      dispatch({ type: wordsActions.toggleLearnedStatus, id });
      dispatch({ type: wordsActions.startRequest });

      try {
        await updateDoc(doc(db, "users", user.uid, "words", id), {
          IsLearned: !originalWord.IsLearned,
        });
        console.log("Word learned status toggled in Firestore for ID:", id);
      } catch (error) {
        console.error(
          "Error toggling word learned status in Firestore:",
          error
        );
        dispatch({
          type: wordsActions.setLoadError,
          error: new Error(
            `Failed to toggle status: ${error.message}. Reverting...`
          ),
        });
        dispatch({ type: wordsActions.revertWord, originalWord });
      } finally {
        dispatch({ type: wordsActions.endRequest });
      }
    },
    [dispatch, user, wordList]
  );

  const deleteWord = useCallback(
    async (id) => {
      if (!user) {
        setAuthErrorMessage("Please log in to delete words.");
        return;
      }
      const originalWordItem = wordList.find((word) => word.id === id);
      if (!originalWordItem) {
        console.warn("Delete Word - Original word not found for ID:", id);
        return;
      }

      const originalWordListBeforeOptimisticDelete = [...wordList];
      dispatch({
        type: wordsActions.revertWord,
        originalWords: wordList.filter((word) => word.id !== id),
      });
      dispatch({ type: wordsActions.startRequest });

      try {
        await deleteDoc(doc(db, "users", user.uid, "words", id));
        console.log("Word deleted from Firestore for ID:", id);
      } catch (error) {
        console.error("Error deleting word from Firestore:", error);
        dispatch({
          type: wordsActions.setLoadError,
          error: new Error(
            `Failed to delete word: ${error.message}. Reverting...`
          ),
        });
        dispatch({
          type: wordsActions.revertWord,
          originalWords: originalWordListBeforeOptimisticDelete,
        });
      } finally {
        dispatch({ type: wordsActions.endRequest });
      }
    },
    [dispatch, user, wordList]
  );

  const handleDismissError = useCallback(() => {
    setAuthErrorMessage("");
  }, []);

  return (
    <div className={styles.app}>
      <Header />
      {authLoading ? (
        <div className={styles.loadingContainer}>
          <p>Loading app (checking login status)...</p>
        </div>
      ) : user ? (
        <>
          <div className={styles.loggedInStatus}>
            <p>
              Logged in as: <strong>{user.email || "Anonymous"}</strong>
            </p>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
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
        </>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <div className={styles.authPageContainer}>
                <AuthForm
                  onLogin={handleLogin}
                  onSignup={handleSignup}
                  onDismissError={handleDismissAuthError}
                  authError={authErrorMessage}
                />
              </div>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
