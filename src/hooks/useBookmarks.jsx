import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addBookmark, removeBookmark, setBookmarks as setReduxBookmarks } from '../store/authSlice';

const BookmarksContext = createContext();
const API_URL = 'http://localhost:5001/api';

export function BookmarksProvider({ children }) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  // Local bookmarks for non-logged-in users
  const [localBookmarks, setLocalBookmarks] = useState(() => {
    const saved = localStorage.getItem('herbalGarden_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('herbalGarden_notes');
    return saved ? JSON.parse(saved) : {};
  });

  const [studyLists, setStudyLists] = useState(() => {
    const saved = localStorage.getItem('herbalGarden_studyLists');
    return saved ? JSON.parse(saved) : [];
  });

  const [studyListNotes, setStudyListNotes] = useState(() => {
    const saved = localStorage.getItem('herbalGarden_studyListNotes');
    return saved ? JSON.parse(saved) : {};
  });

  // Get active bookmarks based on auth state
  const bookmarks = isAuthenticated && user?.bookmarkedPlants
    ? user.bookmarkedPlants
    : localBookmarks;

  // Sync local bookmarks to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('herbalGarden_bookmarks', JSON.stringify(localBookmarks));
    }
  }, [localBookmarks, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('herbalGarden_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('herbalGarden_studyLists', JSON.stringify(studyLists));
  }, [studyLists]);

  useEffect(() => {
    localStorage.setItem('herbalGarden_studyListNotes', JSON.stringify(studyListNotes));
  }, [studyListNotes]);

  // Sync local bookmarks to backend when user logs in
  useEffect(() => {
    const syncBookmarksOnLogin = async () => {
      if (isAuthenticated && localBookmarks.length > 0) {
        try {
          // Merge local bookmarks with user's existing bookmarks
          const existingBookmarks = user?.bookmarkedPlants || [];
          const mergedBookmarks = [...new Set([...existingBookmarks, ...localBookmarks])];

          if (mergedBookmarks.length > existingBookmarks.length) {
            const response = await fetch(`${API_URL}/auth/bookmarks/sync`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ plantIds: mergedBookmarks }),
            });

            if (response.ok) {
              const data = await response.json();
              dispatch(setReduxBookmarks(data.data.bookmarkedPlants.map(p => p._id || p)));
              // Clear local bookmarks after sync
              setLocalBookmarks([]);
              localStorage.removeItem('herbalGarden_bookmarks');
            }
          }
        } catch (error) {
          console.error('Error syncing bookmarks:', error);
        }
      }
    };

    syncBookmarksOnLogin();
  }, [isAuthenticated]);

  const toggleBookmark = useCallback(async (plantId) => {
    const plantIdStr = String(plantId);
    const isCurrentlyBookmarked = bookmarks.map(String).includes(plantIdStr);

    if (isAuthenticated) {
      // Update Redux state immediately for UI responsiveness
      if (isCurrentlyBookmarked) {
        dispatch(removeBookmark(plantIdStr));
      } else {
        dispatch(addBookmark(plantIdStr));
      }

      // Sync with backend
      try {
        const response = await fetch(`${API_URL}/auth/bookmarks`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            plantId: plantIdStr,
            action: isCurrentlyBookmarked ? 'remove' : 'add'
          }),
        });

        if (!response.ok) {
          // Revert on error
          if (isCurrentlyBookmarked) {
            dispatch(addBookmark(plantIdStr));
          } else {
            dispatch(removeBookmark(plantIdStr));
          }
          console.error('Failed to sync bookmark');
        }
      } catch (error) {
        // Revert on error
        if (isCurrentlyBookmarked) {
          dispatch(addBookmark(plantIdStr));
        } else {
          dispatch(removeBookmark(plantIdStr));
        }
        console.error('Error toggling bookmark:', error);
      }
    } else {
      // Not logged in - use local storage
      setLocalBookmarks(prev =>
        prev.map(String).includes(plantIdStr)
          ? prev.filter(id => String(id) !== plantIdStr)
          : [...prev, plantIdStr]
      );
    }
  }, [isAuthenticated, bookmarks, dispatch]);

  const isBookmarked = useCallback((plantId) => {
    return bookmarks.map(String).includes(String(plantId));
  }, [bookmarks]);

  const addNote = (plantId, note) => {
    setNotes(prev => ({
      ...prev,
      [plantId]: note
    }));
  };

  const getNote = (plantId) => notes[plantId] || '';

  const createStudyList = (name) => {
    const newList = {
      id: Date.now(),
      name,
      plants: [],
      createdAt: new Date().toISOString()
    };
    setStudyLists(prev => [...prev, newList]);
    return newList.id;
  };

  const addToStudyList = (listId, plantId) => {
    setStudyLists(prev =>
      prev.map(list =>
        list.id === listId && !list.plants.includes(plantId)
          ? { ...list, plants: [...list.plants, plantId] }
          : list
      )
    );
  };

  const removeFromStudyList = (listId, plantId) => {
    setStudyLists(prev =>
      prev.map(list =>
        list.id === listId
          ? { ...list, plants: list.plants.filter(id => id !== plantId) }
          : list
      )
    );
  };

  const deleteStudyList = (listId) => {
    setStudyLists(prev => prev.filter(list => list.id !== listId));
    // Also remove any notes for this study list
    setStudyListNotes(prev => {
      const updated = { ...prev };
      delete updated[listId];
      return updated;
    });
  };

  const addStudyListNote = (listId, note) => {
    setStudyListNotes(prev => ({
      ...prev,
      [listId]: note
    }));
  };

  const getStudyListNote = (listId) => studyListNotes[listId] || '';

  return (
    <BookmarksContext.Provider value={{
      bookmarks,
      toggleBookmark,
      isBookmarked,
      notes,
      addNote,
      getNote,
      studyLists,
      createStudyList,
      addToStudyList,
      removeFromStudyList,
      addStudyListNote,
      getStudyListNote,
      deleteStudyList
    }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
}
