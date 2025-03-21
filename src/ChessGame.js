import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import MoveHistory from './MoveHistory';

const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameResult, setGameResult] = useState(null);
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [showResignModal, setShowResignModal] = useState(false);

  const checkGameResult = (gameCopy) => {
    if (gameCopy.isGameOver()) {
      if (gameCopy.isCheckmate()) {
        return `${gameCopy.turn() === 'w' ? 'Black' : 'White'} wins by checkmate!`;
      }
      if (gameCopy.isStalemate()) return 'Draw by stalemate';
      if (gameCopy.isThreefoldRepetition()) return 'Draw by threefold repetition';
      if (gameCopy.isInsufficientMaterial()) return 'Draw by insufficient material';
      if (gameCopy.isDraw()) return 'Draw by fifty-move rule';
      return 'Game over';
    }
    return null;
  };

  const onDrop = (sourceSquare, targetSquare) => {
    if (gameResult) return false;

    const gameCopy = new Chess(game.fen());
    const piece = gameCopy.get(sourceSquare);
    
    const moveConfig = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    };

    if (piece?.type === 'p') {
      const isPromotion = (piece.color === 'w' && targetSquare[1] === '8') || 
                         (piece.color === 'b' && targetSquare[1] === '1');
      if (isPromotion) moveConfig.promotion = 'q';
    }

    try {
      const move = gameCopy.move(moveConfig);
      if (move === null) return false;

      const result = checkGameResult(gameCopy);
      if (result) setGameResult(result);

      setGame(gameCopy);
      setMoveHistory((prevHistory) => {
        const isWhiteMove = move.color === 'w';
        const pieceType = move.piece.toUpperCase();

        if (isWhiteMove) {
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
          const updatedHistory = [...prevHistory];
          const lastIndex = updatedHistory.length - 1;
          if (lastIndex >= 0) {
            updatedHistory[lastIndex].black = { 
              san: move.san, 
              piece: pieceType, 
              color: 'black' 
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

  // Draw functionality
  const handleDraw = (accepted) => {
    setShowDrawModal(false);
    if (accepted) {
      setGameResult('Draw by agreement');
    }
  };

  // Resign functionality
  const handleResign = (confirmed) => {
    setShowResignModal(false);
    if (confirmed) {
      const winner = game.turn() === 'w' ? 'Black' : 'White';
      setGameResult(`${winner} wins by resignation`);
    }
  };

  const resetGame = () => {
    setGame(new Chess());
    setMoveHistory([]);
    setGameResult(null);
    setShowDrawModal(false);
    setShowResignModal(false);
  };

  return (
    <div className="game-container">
      <div className="chessboard-container">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          boardWidth={560}
        />
        
        <div className="game-controls">
          <button 
            onClick={() => setShowDrawModal(true)}
            disabled={!!gameResult}
          >
            Offer Draw
          </button>
          <button 
            onClick={() => setShowResignModal(true)}
            disabled={!!gameResult}
          >
            Resign
          </button>
          <button onClick={resetGame}>Reset Game</button>
        </div>

        {/* Draw Modal */}
        {showDrawModal && (
          <div className="confirmation-modal">
            <p>Offer a draw to your opponent?</p>
            <button onClick={() => handleDraw(true)}>Confirm</button>
            <button onClick={() => handleDraw(false)}>Cancel</button>
          </div>
        )}

        {/* Resign Modal */}
        {showResignModal && (
          <div className="confirmation-modal">
            <p>Are you sure you want to resign?</p>
            <button onClick={() => handleResign(true)}>Confirm</button>
            <button onClick={() => handleResign(false)}>Cancel</button>
          </div>
        )}

        {/* Game Result Banner */}
        {gameResult && (
          <div className="game-result-banner">
            <h3>{gameResult}</h3>
            <button onClick={resetGame}>New Game</button>
          </div>
        )}
      </div>
      <MoveHistory moves={moveHistory} />
    </div>
  );
};

export default ChessGame;