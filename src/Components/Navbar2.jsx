import React, { useState, useEffect } from 'react';
import './Navbar.scss';
import { Link, useNavigate } from "react-router-dom";
import newRequest from "../utils/newRequest";

const Navbar2 = ({}) => {
  const [parsedUser, setParsedUser] = useState(null);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        setParsedUser(user);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        setParsedUser(null);
      }
    } else {
      setParsedUser(null);
    }
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await newRequest.post("/Account/logout");
      localStorage.removeItem("currentUser");
      setParsedUser(null); // Reset state after logging out
      navigate("/");
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };


  return (
    <nav className="navbar">
      <Link to="/" id="logo"><h2 id="logo">Notely</h2></Link>
      
      <div className="navbar__user">
        {parsedUser ? (
          <>
            <Link className="navbar__button" to="/allfiles">All files</Link>
            <span className="navbar__username">{parsedUser.userName}</span>
            <div className="navbar__dropdown">
              <Link to="/addnotes">Add notes</Link>
              <Link to="/addfiles">Add files</Link>
              <Link to={`/usernotes/${parsedUser.id}`}>Your notes</Link>
              <Link to={`/userfiles/${parsedUser.id}`}>Your files</Link>
              <button id="logout-button" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </>
        ) : (
          <Link to="/login">
            <button className="navbar__button">Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar2;