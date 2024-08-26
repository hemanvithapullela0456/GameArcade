import React, { useState, useEffect } from 'react';
import './SimonSays.css';

const colors = ["yellow", "red", "purple", "green"];

const SimonSays = () => {
  const [gameSequence, setGameSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    levelUp();
  };

  const levelUp = () => {
    setLevel((prevLevel) => prevLevel + 1);
    const randomColor = colors[Math.floor(Math.random() * 4)];
    setGameSequence((prevSequence) => [...prevSequence, randomColor]);
    setUserSequence([]);
    flashSequence([...gameSequence, randomColor]);
  };

  const flashSequence = async (sequence) => {
    for (const color of sequence) {
      const btnElement = document.querySelector(`.${color}`);
      await btnFlash(btnElement);
    }
  };

  const btnFlash = (btnElement) => {
    return new Promise((resolve) => {
      btnElement.classList.add("flash");
      setTimeout(() => {
        btnElement.classList.remove("flash");
        resolve();
      }, 500);
    });
  };

  const handleButtonClick = (color) => {
    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);

    if (newUserSequence[newUserSequence.length - 1] !== gameSequence[newUserSequence.length - 1]) {
      setIsGameOver(true);
      setIsPlaying(false);
    } else if (newUserSequence.length === gameSequence.length) {
      setTimeout(levelUp, 1000);
    }
  };

  const resetGame = () => {
    setGameSequence([]);
    setUserSequence([]);
    setLevel(0);
    setIsPlaying(false);
    setIsGameOver(false);
  };

  return (
    <div className="simon-says-container">
      <h1>Simon Says</h1>
      {!isPlaying && !isGameOver && (
        <button className="start-game-button" onClick={startGame}>
          Start Game
        </button>
      )}
      {isPlaying && (
        <div className="score-card" style={{fontSize:'25px',marginBottom:'10px'}}>Level: {level}</div>
      )}
      <div className="color-buttons">
        {colors.map((color) => (
          <div
            key={color}
            className={`color-button ${color}`}
            onClick={() => isPlaying && handleButtonClick(color)}
          ></div>
        ))}
      </div>
      {isGameOver && (
        <div className="game-over-card">
          <h2>Game Over!</h2>
          <p>Final Level: {level}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default SimonSays;
