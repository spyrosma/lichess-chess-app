import React from 'react';

const MoveHistory = ({ moves }) => {
  // Convert SAN (e.g., "Nf3") to icon + notation
  const sanToIcon = (san, piece, color) => {
    const notation = san.replace(/^[KQRNBP]/, ''); // Remove piece letter
    return (
      <span className={`${color} ${piece}`}>
        {notation} {/* Icon added via CSS pseudo-element */}
      </span>
    );
  };

  return (
    <div className="move-history">
      <h3>Move History</h3>
      <div className="move-list">
        {moves.map((move) => (
          <div key={move.moveNumber} className="move-pair">
            <span className="move-number">{move.moveNumber}.</span>
            <span className="white-move">
              {move.white ? sanToIcon(move.white.san, move.white.piece, move.white.color) : ''}
            </span>
            <span className="black-move">
              {move.black ? sanToIcon(move.black.san, move.black.piece, move.black.color) : '...'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoveHistory;