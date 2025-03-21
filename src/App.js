import React from 'react';
import ChessGame from './ChessGame';
import './App.css'; // Import the CSS file

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Lichess Chess Game</h1>
        <p>Play chess using Lichess's open-source platform!</p>
      </header>
      <main className="main-container">
        <ChessGame />
      </main>
    </div>
  );
}

export default App;