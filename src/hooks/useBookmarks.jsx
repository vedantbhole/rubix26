import { useState, useEffect, createContext, useContext } from 'react';

const BookmarksContext = createContext();

export function BookmarksProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(() => {
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

  useEffect(() => {
    localStorage.setItem('herbalGarden_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('herbalGarden_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('herbalGarden_studyLists', JSON.stringify(studyLists));
  }, [studyLists]);

  const toggleBookmark = (plantId) => {
    setBookmarks(prev => 
      prev.includes(plantId) 
        ? prev.filter(id => id !== plantId)
        : [...prev, plantId]
    );
  };

  const isBookmarked = (plantId) => bookmarks.includes(plantId);

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
  };

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
