import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useSession } from "../../hook/AuthHook";
import { useSocket } from "@/hook/SocketHook";

const Chat = () => {
	const user = useSession((state) => state.user);
	const matchData = useSocket((state) => state.matchData);
	const socket = useSocket((state) => state.socket);
	const [messages, setMessages] = useState([]);

	const socketIDOponent = () => {
		console.log(matchData);
		if (matchData === null) return;
		if (matchData.user1.user.id == user.id) {
			return matchData.user2.socketID;
		}
		return matchData.user1.socketID;
	};

	const nameOponent = () => {
		console.log(matchData);
		if (matchData === null) return;
		if (matchData.user1.user.id == user.id) {
			return matchData.user2.user.username;
		}
		return matchData.user1.user.username;
	};
	useEffect(() => {
		if (socket == null) return;
		socket.on("getMessage", (data) => {
			const name = nameOponent();
			const msg = {
				senderId: data.senderId,
				content: data.content,
				senderName: name,
			};
			setMessages([...messages, msg]);
		});
	}, [socket, messages]);
	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			if (!e.target.value || e.target.value === "") return;

			setMessages([
				...messages,
				{
					senderId: user?.id,
					content: e.target.value,
					senderName: "You",
				},
			]);
			if (socket == null) return;
			const socketId = socketIDOponent();
			const dataMsg = {
				senderId: user?.id,
				content: e.target.value,
				socketId: socketId,
			};
			socket.emit("sendMessage", dataMsg);
			e.target.value = "";
		}
	};

	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(scrollToBottom, [messages]);

	const handleClick = () => {
		const input = document.querySelector("input");

		if (!input.value || input.value === "") return;

		setMessages([
			...messages,
			{
				senderId: user?.id,
				content: input.value,
				senderName: "You",
			},
		]);
		if (socket == null) return;
		const socketId = socketIDOponent();
		const dataMsg = {
			senderId: user?.id,
			content: input.value,
			socketId: socketId,
		};
		socket.emit("sendMessage", dataMsg);
		input.value = "";
	};

	return (
		<div className="size-full flex flex-col py-3">
			<div className="flex-1 overflow-y-auto py-3 px-4">
				{messages.map((message, index) => (
					<div key={index} className="flex gap-2">
						<div className="flex flex-col w-full">
							<span
								className={`w-full font-bold ${
									message.senderId === user?.id
										? "text-blue-500 text-right"
										: "text-red-500"
								}`}
							>
								{message.senderId === user?.id ? "You" : message.senderName}
							</span>

							<span
								className={`${
									message.senderId === user?.id ? "text-right" : ""
								}`}
							>
								{message.content}
							</span>
						</div>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>

			<div className="flex w-full h-10 px-2 gap-2">
				<input
					onKeyDown={handleKeyDown}
					type="text"
					placeholder="Type your message here"
					className="flex-1 rounded-lg border-2 border-gray-400 px-2"
				/>
				<button onClick={handleClick}>
					<Image alt="send" src="/assets/send.svg" width={25} height={25} />
				</button>
			</div>
		</div>
	);
};

export default Chat;
