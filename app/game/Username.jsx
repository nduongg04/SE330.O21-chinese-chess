import React from 'react';
import { useSocket } from "@/hook/SocketHook";
import { useSession } from "@/hook/AuthHook";
import './Username.css';

const Username = ({ timercolor, currentUser }) => {
    const matchData = useSocket((state) => state.matchData);
    const currentUser = useSession((state) => state.user);

    const player1Name = matchData?.user1?.name;
    const player2Name = matchData?.user2?.name;

    const isPlayer1Turn = matchData?.turn === 'user1';
    const isPlayer2Turn = matchData?.turn === 'user2';
    const isRed = timercolor === 'red';

    return (
        <div className="username-container">
            <div className={`username ${isPlayer1Turn ? 'red' : 'black'}`}>
                <div className="avatar player1"></div>
                {player1Name}
                {isRed && <img src="/public/assets/piece_assets/RGeneral.png" className="general-icon" alt="Red General" />}
            </div>
            <div className={`username ${isPlayer2Turn ? 'red' : 'black'}`}>
                {isRed && <img src="/public/assets/piece_assets/BGeneral.png" className="general-icon" alt="Black General" />}
                {player2Name}
                <div className="avatar player2"></div>
            </div>
        </div>
    );
};

export default Username;

