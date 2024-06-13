import React from "react";
import "./Username.css";

const Username = ({ color, playerName, avatar, pieceImage, currentPlayer }) => {
	return (
		<div
			className={`username ${currentPlayer === color ? "bottom-0" : "top-0"}`}
		>
			<img src={avatar} alt="Avatar" className="avatar" />
			<span className="player-name">{playerName}</span>
			<img src={pieceImage} alt="Piece" className="piece-image" />
		</div>
	);
};

export default Username;
