import React from 'react';
import './NotesPopup.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import newRequest from '../utils/newRequest';
import { useNavigate } from 'react-router-dom';

const NotesPopup = ({ note, onClose, onDelete }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await newRequest.delete(`/Notes/${note.id}`);
      onDelete(note.id);
      onClose();
      window.location.reload(); // Reload the page after deletion
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const handleEdit = () => {
    navigate(`/editnote/${note.id}`);
  };

  return (
    <div className="notes-popup-background">
      <div className="notes-popup">
        <div className='top-of-card'>
          <p id="university">{note.university}</p>
          {note.userId === currentUser.id && (
            <>
              <FontAwesomeIcon
                icon={faEdit}
                onClick={handleEdit}
                className="edit-icon"
              />
              <FontAwesomeIcon
                icon={faTrash}
                onClick={handleDelete}
                className="delete-icon"
              />
            </>
          )}
        </div>
        <hr />
        <div>
          <h2>{note.title}</h2>
          <p>{note.noteBody}</p>
          <button id="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default NotesPopup;
