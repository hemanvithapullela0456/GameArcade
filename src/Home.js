// src/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Ensure this CSS file is created and updated

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="app-heading"  style={{color:'black'}}>Arcade Arena</h1>
        <p className="app-tagline">Adventure Awaits in Every Game</p>
        <div className="app-options">
          <Link to="/sudoku" className="app-button-link">
            <button className="app-button">Sudoku Solver</button>
          </Link>
          <Link to="/simon" className="app-button-link">
            <button className="app-button">Simon Says</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
