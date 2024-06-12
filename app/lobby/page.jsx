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
import useIsFinding from "@/hook/useIsFinding";

const Lobby = () => {
	const router = useRouter();
	const user = useSession((state) => state.user);
	if (!user) {
		router.replace("/login");
	}
	const socket = useSocket((state) => state.socket);
	const setSocket = useSocket((state) => state.setSocket);
	const setOnlineUsers = useSocket((state) => state.setOnlineUsers);
	const setMatchData = useSocket((state) => state.setMatchData);
	const matchData = useSocket((state) => state.matchData);
	const [isMatch, setIsMatch] = useState(false);

	const isFinding = useIsFinding((state) => state.isFinding);
	const setIsFinding = useIsFinding((state) => state.setIsFinding);

	const socketIDOponent = () => {
		console.log(matchData);
		if (matchData === null) return;
		if (matchData.user1.user.id == user.id) {
			return matchData.user2.socketID;
		}
		return matchData.user1.socketID;
	};

	useEffect(() => {
		setIsFinding(false);

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
		<div className="flex justify-center items-center">
			<div className="flex-col flex w-60 border-[#E3E3E3] border rounded-lg absolute bottom-3 right-3 shadow-md shadow-gray-300 py-1 gap-3">
				<div className="flex-1 w-full flex justify-between items-center px-3 pt-2">
					<span className="text-lg font-medium">{user?.username}</span>
					<span className="text-xl font-medium text-sky-500">{user?.elo}</span>
				</div>
				<button
					onClick={handleLogout}
					className="text-rose-500 hover:text-white flex-1 flex justify-between px-3 py-3 rounded-md items-center gap-2 hover:bg-rose-500 group/logout"
				>
					<span className="font-medium">Log out</span>
					<svg
                        className="fill-current"
						width="30"
						height="30"
						viewBox="0 0 15 14"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M9.98973 2.03514V3.59514L10.9897 2.60514V0.765137L10.4897 0.265137H1.48973L0.989727 0.765137V1.25114L0.969727 1.26514V11.5551L1.32973 12.0151L6.32973 13.7351L6.96973 13.2651V12.2651H10.4897L10.9897 11.7651V9.95514L9.98973 8.95514V11.2651H6.96973V2.97514L6.63973 2.51514L3.00573 1.26514H9.98973V2.03514ZM5.96973 12.5451L1.96973 11.2051V1.98514L5.96973 3.32514V12.5451ZM12.4897 6.74514H7.51973V5.74514H12.4497L10.8497 4.14514L11.5597 3.44514L14.0297 5.90514V6.61514L11.5397 9.09514L10.8397 8.39514L12.4897 6.74514Z"
							// fill="#FF3C3C"
						/>
					</svg>
				</button>
			</div>
			<div className="xl:flex mr-6 hidden justify-center">
				<Image
					alt="Chinese Chess"
					src="/assets/lobby.jpg"
					width={400}
					height={600}
				/>
			</div>

			<div className="flex items-center justify-center my-11">
				{/* Menu bar */}
				<div className="w-[400px] h-[600px] border-gray-300 border shadow-lg shadow-indigo-200 flex-col flex">
					<div className="h-[60px] w-full flex flex-row">
						{buttonsInformation.map((button, index) => (
							<button
								key={index}
								disabled={isFinding}
								className={`disabled:opacity-50 flex-1 flex justify-center items-center flex-col border-x border-gray-300 ${
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
