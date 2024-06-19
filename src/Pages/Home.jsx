import React, { useState, useEffect } from "react";
import NotesCard from '../Components/NotesCard';
import NotesPopup from '../Components/NotesPopup';
import './Home.scss';
import Navbar from '../Components/Navbar';
import { useQuery } from "@tanstack/react-query";
import newRequest from "../utils/newRequest.js";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [randomFiles, setRandomFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { isLoading: notesLoading, error: notesError, data: notesData } = useQuery({
    queryKey: ['notesData', selectedCategory],
    queryFn: () => newRequest.get(`/Notes${selectedCategory ? `?categoryId=${selectedCategory}` : ''}`).then(res => res.data)
  });

  const { isLoading: filesLoading, error: filesError, data: filesData } = useQuery({
    queryKey: ['randomFiles', selectedCategory],
    queryFn: () => newRequest.get(`/Files/random${selectedCategory ? `?categoryId=${selectedCategory}` : ''}`).then(res => res.data)
  });

  useEffect(() => {
    if (notesData) {
      setNotes(notesData);
    }
  }, [notesData]);

  useEffect(() => {
    if (filesData) {
      setRandomFiles(filesData);
    }
  }, [filesData]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await newRequest.get("/Categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = (deletedNoteId) => {
    setNotes((prevNotes) => prevNotes.filter(note => note._id !== deletedNoteId));
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };

  const handleClosePopup = () => {
    setSelectedNote(null);
  };

  const handleOpenFile = async (fileId) => {
    try {
      const response = await newRequest.get(`/Files/download/${fileId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className='top-div'>
        <h1>Share and Discover Knowledge</h1>
        <p>Join our community to access and share your study notes and resources.</p>
      </div>
      <div className="categories-div">
        <h3>Categories</h3>
        <ul>
          <li onClick={() => setSelectedCategory(null)}>All</li>
          {categories.map((category) => (
            <li key={category.id} onClick={() => setSelectedCategory(category.id)}>
              {category.name}
            </li>
          ))}
        </ul>
      </div>
      <h4>Files</h4>
      <div className="files-div">
        {filesLoading ? (
          "loading"
        ) : filesError ? (
          <div>{filesError.message || JSON.stringify(filesError)}</div>
        ) : (
          randomFiles.map((file) => (
            <div key={file.id} className="file-card">
              <h3>{file.title}</h3>
              <p>{file.university}</p>
              <p>{file.category}</p>
              <button onClick={() => handleOpenFile(file.id)}>Open</button>
            </div>
          ))
        )}
      </div>
      <h3>Notes</h3>
      <div className='notes-div'>
        {notesLoading ? (
          "loading"
        ) : notesError ? (
          <div>{notesError.message || JSON.stringify(notesError)}</div>
        ) : (
          notes.map((note) => (
            <NotesCard
              key={note._id}
              note={note}
              onClick={() => handleNoteClick(note)}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
      {selectedNote && (
        <NotesPopup
          note={selectedNote}
          onClose={handleClosePopup}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default Home;
