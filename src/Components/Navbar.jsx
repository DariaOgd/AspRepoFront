import React, { useState, useEffect } from 'react';
import './Navbar.scss';
import { Link, useNavigate } from "react-router-dom";
import newRequest from "../utils/newRequest";

const Navbar = () => {
  const [parsedUser, setParsedUser] = useState(null);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    console.log("Current user from localStorage:", currentUser);

    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        console.log("Parsed user:", user);
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
      console.log("User logged out");
      setParsedUser(null); // Reset state after logging out
      navigate("/");
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  return (
    <nav className="navbar">
      <h2>Notely</h2>
      <div className="navbar__search">
        <input type="text" placeholder="Search..." className="navbar__input" />
      </div>
      <div className="navbar__user">
        {parsedUser ? (
          <>
            <Link className="navbar__button" to="/allfiles">All files</Link> {/* New button */}
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

export default Navbar;
