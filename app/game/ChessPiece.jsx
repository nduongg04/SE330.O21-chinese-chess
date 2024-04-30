import React, { useEffect, useState } from 'react';
import './GameBoard.css';
import ImagePath from './PieceString';
const ChessPiece = ({ type, position, color,handleOnClick}) => {
  const display = {
    'chariot': {
        'red': ImagePath.chessdemo,
        'black': ImagePath.chessdemo
      },
      'advisor': {
        'red': ImagePath.chessdemo,
        'black': ImagePath.chessdemo
      },
      'cannon': {
        'red': ImagePath.chessdemo,
        'black': ImagePath.chessdemo
      },
      'soldier': {
        'red': ImagePath.chessdemo,
        'black': ImagePath.chessdemo
      },
      'horse': {
        'red': ImagePath.chessdemo,
        'black': ImagePath.chessdemo
      },
      'elephant': {
        'red': ImagePath.chessdemo,
        'black': ImagePath.chessdemo
      },
      'general': {
        'red': ImagePath.chessdemo,
        'black': ImagePath.chessdemo
      },
  };
  
   const [isSelected, setisSelected] = useState(false);
  // const handleOnClick = useEffect(()=>{
  //   setisSelected(!isSelected)
  // })
  return (
    <div
      className={`chess-piece ${isSelected ? 'selected' : ''}`}
      style={{
        gridRow: position.x + 1,
        gridColumn: position.y + 1,
      }}
      onClick={handleOnClick}
    >
      <img src={display[type][color]} alt="" />
    </div>
  );
};

export default ChessPiece;