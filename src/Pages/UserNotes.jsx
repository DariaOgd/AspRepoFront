import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import newRequest from "../utils/newRequest";
import NotesCard from '../Components/NotesCard';
import './UserNotes.scss';
import Navbar2 from '../Components/Navbar2';

function UserNotes() {
  const { userId } = useParams();
  const [userNotes, setUserNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserNotes = async () => {
      console.log("userId:", userId);

      if (!userId) {
        setLoading(false);
        setError("User ID is missing.");
        return;
      }

      try {
        const notesResponse = await newRequest.get(`/Notes/user/${userId}`);
        console.log("notesResponse.data:", notesResponse.data);
        setUserNotes(notesResponse.data);
      } catch (err) {
        console.error("Error fetching user notes:", err);
        setError("Error fetching user notes: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserNotes();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-notes">
            <Navbar2 />
            <h2 id="heading-2">Your Notes</h2>
      <div className="notes-container">
        {userNotes.length > 0 ? (
          userNotes.map((note) => (
            <NotesCard key={note.id} note={note} />
          ))
        ) : (
          <p>No notes found.</p>
        )}
      </div>
    </div>
  );
}

export default UserNotes;
