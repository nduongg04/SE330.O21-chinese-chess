import React from 'react';
import './Username.css';

const Username = ({ top, bot, left, right, player }) => {
    return (
        <div className="username" style={{ top: `${top}px`, bottom: `${bot}px`, left: `${left}px`, right: `${right}px` }}>
            {player}
        </div>
    );
};

export default Username;
