import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const SavedContext = createContext(null);

export const SavedProvider = ({ children }) => {
  const [savedMap, setSavedMap] = useState({});

  const toggleSave = useCallback((item) => {
    if (!item || !item._id) {
      return;
    }

    setSavedMap((prev) => {
      if (prev[item._id]) {
        const { [item._id]: _removed, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [item._id]: item,
      };
    });
  }, []);

  const isSaved = useCallback((id) => Boolean(id && savedMap[id]), [savedMap]);

  const value = useMemo(
    () => ({
      savedItems: savedMap,
      savedList: Object.values(savedMap),
      toggleSave,
      isSaved,
    }),
    [savedMap, toggleSave, isSaved]
  );

  return (
    <SavedContext.Provider value={value}>{children}</SavedContext.Provider>
  );
};

export const useSaved = () => {
  const context = useContext(SavedContext);

  if (!context) {
    throw new Error("useSaved must be used within a SavedProvider");
  }

  return context;
};
