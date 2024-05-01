import { useSession } from "@/hook/AuthHook";
import { useSocket } from "@/hook/SocketHook";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const NewGame = () => {
	const socket = useSocket((state)=> state.socket)
	const user = useSession((state)=> state.user)
	const times = [
		{
			time: 10,
			text: "10 mins",
		},
		{
			time: 15,
			text: "15 mins",
		},
		{
			time: 20,
			text: "20 mins",
		},
	];
	
	const [selectedTime, setSelectedTime] = useState(0);
	const [color, setColor] = useState("black");
	const [textPlayButton, setTextPlayButton]= useState("Play")
    const handleClickPlay = () => {
		if(textPlayButton=="Play"){
			if(socket==null) return
			const data= {
				min: times[selectedTime].time,
				user: user,
				color: color
			}
			socket.emit("findMatch", data)
			setTextPlayButton("Cancel")
		}
		else{
			socket.emit("cancelFindMatch", user.id)
			setTextPlayButton("Play")
		}
	};

	return (
		<div className="h-full px-6 py-10 flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<label
					className="font-inter text-base font-medium text-gray-900"
					htmlFor="Time"
				>
					Time
				</label>
				<select
					id="time"
					name="time"
					selected={selectedTime}
					onChange={(e) => {
						setSelectedTime(e.target.value);
						console.log(selectedTime);
					}}
					className="text-center text-md rounded-md border border-[#A1A0A0] p-2"
				>
					{times.map((time, index) => (
						<option key={index} value={time.time}>
							{time.text}
						</option>
					))}
				</select>
			</div>

			<div className="flex flex-col gap-2">
				<label
					className="font-inter text-base font-medium text-gray-900"
					htmlFor="Time"
				>
					Opponent
				</label>
				<span className="border border-[#a1a0a0] p-2  rounded-md text-center">
					Random
				</span>
			</div>

			<div className="flex flex-row items-center justify-between gap-2">
				<label
					className="font-inter text-base font-medium text-gray-900"
					htmlFor="Time"
				>
					Color
				</label>
				<div>
					<button
						className={`"${color === "black" ? "bg-blue-400" : ""}"`}
						onClick={(e) => setColor("black")}
					>
						<Image
							src={`${color === "black" ? "/assets/black-color-pressed.svg" : "/assets/black-color.svg"}`}
							width={40}
							height={40}
							className="hover:w-11 h-auto"
						/>
					</button>
					<button onClick={(e) => setColor("red")}>
						<Image
							src={`${color === "red" ? "/assets/red-color-pressed.svg" : "/assets/red-color.svg"}`}
							width={40}
							height={40}
							className="hover:w-11"
						/>
					</button>
				</div>
			</div>

			<button className="p-2 mt-auto h-[45px] rounded-lg bg-green-400 hover:text-xl hover:bg-green-500 text-white font-semibold text-lg" onClick={handleClickPlay}>
				{textPlayButton}
			</button>
		</div>
	);
};

export default NewGame;
