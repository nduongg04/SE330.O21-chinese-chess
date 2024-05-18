import React from 'react';
import './Username.css';

const Username = ({ color, playerName, avatar, pieceImage }) => {
    return (
        <div className={`username ${color}`}>
            <img src={avatar} alt="Avatar" className="avatar" />
            <span className="player-name">{playerName}</span>
            <img src={pieceImage} alt="Piece" className="piece-image" />
        </div>
    );
};

export default Username;