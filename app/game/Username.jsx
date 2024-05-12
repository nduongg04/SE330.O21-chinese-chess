import React from 'react';
import { useSocket } from "@/hook/SocketHook";
import { useSession } from "@/hook/AuthHook";
import './Username.css';

const Username = () => {
    const matchData = useSocket((state) => state.matchData);
    const currentUser = useSession((state) => state.user);

    const player1Name = matchData?.user1?.name;
    const player2Name = matchData?.user2?.name;

    const isPlayer1Turn = matchData?.turn === 'user1';
    const isPlayer2Turn = matchData?.turn === 'user2';

    return (
        <div className="username-container">
            <div className={`username ${isPlayer1Turn ? 'red' : 'black'}`}>
                <div className="avatar player1"></div>
                {player1Name}
            </div>
            <div className={`username ${isPlayer2Turn ? 'red' : 'black'}`}>
                <div className="avatar player2"></div>
                {player2Name}
            </div>
        </div>
    );
};

export default Username;

