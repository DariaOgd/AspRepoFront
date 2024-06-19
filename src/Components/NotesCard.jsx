import React, { useState } from 'react';
import './NotesCard.scss';
import NotesPopup from './NotesPopup';

const NotesCard = ({ note, onDelete }) => {
  const [popupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => {
    setPopupVisible(!popupVisible);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  return (
    <div className='card' onClick={togglePopup}>
      <div className="top-of-card">
        <p id="university">{note?.university}</p> 
      </div>
      <hr />
      <div className='bottom-of-card'>
        <p id="title">{note?.title || 'No Title'}</p> 
        <p id="notebody">{note?.noteBody?.substring(0, 225) + "..." || 'No Content'}</p> 
      </div>
      
      {popupVisible && <NotesPopup note={note} onClose={closePopup} onDelete={onDelete} />} 
    </div>
  );
};

export default NotesCard;
