import React, { useEffect, useState } from 'react';
import './GameBoard.css';

import ImagePaths from './PieceString'
const ChessPiece = ({ type, position, color,handleOnClick}) => {
  const display = {
    'chariot': {
        'red': ImagePaths.RChariot,
        'black': ImagePaths.BChariot
      },
      'advisor': {
        'red': ImagePaths.RAdvisor,
        'black': ImagePaths.BAdvisor
      },
      'cannon': {
        'red': ImagePaths.RCannon,
        'black': ImagePaths.BCannon
      },
      'soldier': {
        'red': ImagePaths.RSoldier,
        'black': ImagePaths.BSoldier
      },
      'horse': {
        'red': ImagePaths.RHorse,
        'black': ImagePaths.BHorse
      },
      'elephant': {
        'red': ImagePaths.RElephant,
        'black': ImagePaths.BElephant
      },
      'general': {
        'red': ImagePaths.RGeneral,
        'black': ImagePaths.BGeneral
      },
  };
  
  return (
    <div
      className={`chess-piece`}
      style={{
        gridRow: position.x + 1,
        gridColumn: position.y + 1,
      }}
      onClick={handleOnClick}
    >
      <img src= {display[type][color]} />
    </div>
  );
};

export default ChessPiece;