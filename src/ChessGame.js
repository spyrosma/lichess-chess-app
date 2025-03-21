import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import MoveHistory from './MoveHistory';

const ChessGame = () => {
  const [game, setGame] = useState(new Chess()); 
  const [moveHistory, setMoveHistory] = useState([]);

  const onDrop = (sourceSquare, targetSquare) => {
    const gameCopy = new Chess(game.fen());

    try {
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });

      if (move === null) return false;

      setGame(gameCopy);
      setMoveHistory((prevHistory) => {
        const isWhiteMove = move.color === 'w';
        const pieceType = move.piece.toUpperCase(); // 'P', 'N', 'B', 'R', 'Q', 'K'

        if (isWhiteMove) {
          // Add new move pair for White's turn
          return [
            ...prevHistory,
            { 
              moveNumber: prevHistory.length + 1,
              white: {
                san: move.san,
                piece: pieceType,
                color: 'white'
              },
              black: null
            }
          ];
        } else {
          // Update last move pair with Black's move
          const updatedHistory = [...prevHistory];
          const lastIndex = updatedHistory.length - 1;
          
          if (lastIndex >= 0) {
            updatedHistory[lastIndex] = {
              ...updatedHistory[lastIndex],
              black: {
                san: move.san,
                piece: pieceType,
                color: 'black'
              }
            };
          }
          return updatedHistory;
        }
      });

      return true;
    } catch (error) {
      console.error('Move error:', error);
      return false;
    }
  };

  const resetGame = () => {
    setGame(new Chess());
    setMoveHistory([]);
  };

  return (
    <div className="game-container">
      <div className="chessboard-container">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          boardWidth={560}
        />
        <button onClick={resetGame}>Reset Game</button>
      </div>
      <MoveHistory moves={moveHistory} />
    </div>
  );
};

export default ChessGame;