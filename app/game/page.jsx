"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import NewGame from "@/components/lobby/NewGame";
import Leaderboard from "@/components/lobby/Leaderboard";
import { useRouter } from "next/navigation";
import Chat from "@/components/game/Chat";
import GameBoard from "./GameBoard";

const Game = () => {
	const router = useRouter();
	const buttonsInformation = [
		{
			iconReg: "/assets/chat-reg.svg",
			iconPressed: "/assets/chat.svg",
			text: "Chat",
		},
		{
			iconReg: "/assets/plus-fill-reg.svg",
			iconPressed: "/assets/plus-fill.svg",
			text: "New game",
		},
		{
			iconReg: "/assets/leaderboard-reg.svg",
			iconPressed: "/assets/leaderboard.svg",
			text: "Leaderboard",
		},
	];

	const [buttonPressed, setButtonPressed] = useState("Chat");

	const componentsMap = {
		Chat: <Chat />,
		"New game": <NewGame />,
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
				onClick={handleLogout}
				className="bg-red-500 rounded-lg absolute bottom-3 right-3 hover:shadow-xl shadow-indigo-400"
			>
				<Image src="/assets/logout.svg" width={45} height={45} />
			</button>
			<div className="xl:block hidden w-[854px]">
				<GameBoard/>
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

export default Game;
