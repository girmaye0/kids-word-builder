const actions = {
  fetchWords: "FETCH_WORDS",
  loadWords: "LOAD_WORDS",
  setLoadError: "SET_LOAD_ERROR",
  startRequest: "START_REQUEST",
  addWord: "ADD_WORD",
  endRequest: "END_REQUEST",
  updateWord: "UPDATE_WORD",
  toggleLearnedStatus: "TOGGLE_LEARNED_STATUS",
  revertWord: "REVERT_WORD",
  clearError: "CLEAR_ERROR",
  setSortField: "SET_SORT_FIELD",
  setSortDirection: "SET_SORT_DIRECTION",
  setQueryString: "SET_QUERY_STRING",
};

const initialState = {
  wordList: [],
  isLoading: false,
  errorMessage: "",
  isSaving: false,
  sortField: "createdTime",
  sortDirection: "desc",
  queryString: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.fetchWords:
      return { ...state, isLoading: true, errorMessage: "" };

    case actions.loadWords:
      const fetchedWords = action.records.map((record) => ({
        id: record.id,
        fields: {
          Word: record.fields.Word || "",
          IsLearned: record.fields.IsLearned || false,
          ...record.fields,
        },
        createdTime: record.createdTime,
      }));
      return { ...state, wordList: fetchedWords, isLoading: false };

    case actions.addWord:
      const savedWord = {
        id: action.record.id,
        fields: {
          Word: action.record.fields.Word || "",
          IsLearned: action.record.fields.IsLearned || false,
          ...action.record.fields,
        },
        createdTime: action.record.createdTime,
      };
      return {
        ...state,
        wordList: [...state.wordList, savedWord],
        isSaving: false,
      };

    case actions.startRequest:
      return { ...state, isSaving: true, errorMessage: "" };

    case actions.endRequest:
      return { ...state, isSaving: false };

    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
        isSaving: false,
      };

    case actions.clearError:
      return { ...state, errorMessage: "" };

    case actions.setSortField:
      return { ...state, sortField: action.field };

    case actions.setSortDirection:
      return { ...state, sortDirection: action.direction };

    case actions.setQueryString:
      return { ...state, queryString: action.query };

    case actions.revertWord:
      if (action.originalWord) {
        return {
          ...state,
          wordList: state.wordList.map((word) =>
            word.id === action.originalWord.id
              ? { ...action.originalWord }
              : word
          ),
        };
      } else if (action.originalWords) {
        return {
          ...state,
          wordList: action.originalWords,
        };
      }
      return state;

    case actions.updateWord:
      const updatedWordList = state.wordList.map((word) =>
        word.id === action.editedWord.id ? { ...action.editedWord } : word
      );

      let newState = {
        ...state,
        wordList: updatedWordList,
      };

      if (action.error) {
        newState.errorMessage = action.error.message;
      }
      return newState;

    case actions.toggleLearnedStatus:
      return {
        ...state,
        wordList: state.wordList.map((word) =>
          word.id === action.id
            ? {
                ...word,
                fields: { ...word.fields, IsLearned: !word.fields.IsLearned },
              }
            : word
        ),
      };

    default:
      return state;
  }
};

export { actions, initialState, reducer };
