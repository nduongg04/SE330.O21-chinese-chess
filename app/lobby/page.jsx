"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import NewGame from "@/components/lobby/NewGame";
import History from "@/components/lobby/History";
import Leaderboard from "@/components/lobby/Leaderboard";
import { useRouter } from "next/navigation";
import { useSocket } from "@/hook/SocketHook";
import { useSession } from "@/hook/AuthHook";
import { io } from "socket.io-client";

const Lobby = () => {
	const user = useSession((state) => state.user);
	const socket = useSocket((state) => state.socket);
	const setSocket = useSocket((state) => state.setSocket);
	const setOnlineUsers = useSocket((state) => state.setOnlineUsers);
	const setMatchData = useSocket((state) => state.setMatchData);
	const matchData = useSocket((state)=> state.matchData)
	const [isMatch, setIsMatch] = useState(false);
	const router = useRouter();

	const socketIDOponent = () => {
		console.log(matchData);
		if (matchData === null) return;
		if (matchData.user1.user.id == user.id) {
			return matchData.user2.socketID;
		}
		return matchData.user1.socketID;
	};


	useEffect(() => {
		if (user == null) router.replace("/login");
		const newSocket = io("https://chinesechess-socket.onrender.com");
		setSocket(newSocket);
	}, []);
	useEffect(() => {
		if (socket == null) return;
		socket.on("getMatchData", (data) => {
			setIsMatch(true);
			setMatchData(data);
		});

		return () => {
			socket.off("getMatchData");
		};
	}, [isMatch, socket]);

	useEffect(() => {
		console.log(isMatch);
		if (isMatch) {
			router.push("/game");
		}
	}, [isMatch]);
	useEffect(() => {
		if (socket == null) return;
		socket.emit("addOnlineUser", user?.id);
		socket.on("getOnlineUsers", (users) => {
			setOnlineUsers(users);
		});
	}, [socket]);
	const buttonsInformation = [
		{
			iconReg: "/assets/plus-fill-reg.svg",
			iconPressed: "/assets/plus-fill.svg",
			text: "New game",
		},
		{
			iconReg: "/assets/history-reg.svg",
			iconPressed: "/assets/history.svg",
			text: "History",
		},
		{
			iconReg: "/assets/leaderboard-reg.svg",
			iconPressed: "/assets/leaderboard.svg",
			text: "Leaderboard",
		},
	];

	const [buttonPressed, setButtonPressed] = useState("New game");

	const componentsMap = {
		"New game": <NewGame />,
		History: <History />,
		Leaderboard: <Leaderboard />,
	};

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		router.push("/login");
	};

	return (
		<div className="flex gap-7 justify-center items-center">
			<button
				title="Log out"
				onClick={handleLogout}
				className="bg-red-500 rounded-lg absolute bottom-3 right-3 hover:shadow-xl shadow-indigo-400"
			>
				<Image alt="logout" src="/assets/logout.svg" width={45} height={45} />
			</button>
			<div className="xl:block hidden w-[854px] bg-red-300">
				Bàn cờ + player
			</div>

			<div className="flex items-center justify-center my-11">
				{/* Menu bar */}
				<div className="w-[400px] h-[600px] border-gray-300 border shadow-lg shadow-indigo-200 flex-col flex">
					<div className="h-[60px] w-full flex flex-row">
						{buttonsInformation.map((button, index) => (
							<button
								key={index}
								className={`flex-1 flex justify-center items-center flex-col border-x border-gray-300 ${
									buttonPressed === button.text ? "bg-white" : "bg-slate-200"
								} `}
								onClick={() => setButtonPressed(button.text)}
							>
								<Image
									alt="Button icon"
									src={
										buttonPressed === button.text
											? button.iconPressed
											: button.iconReg
									}
									width={25}
									height={25}
								/>
								{button.text}
							</button>
						))}
					</div>
					<div className="flex-1 overflow-hidden">
						{componentsMap[buttonPressed]}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Lobby;
