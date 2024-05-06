import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useSession } from "../../hook/AuthHook";

const Chat = () => {
	const user = useSession((state) => state.user);

	const [messages, setMessages] = useState([
		{
			senderId: user?.id,
			content: "Hello",
			senderName: "John Doe",
		},
		{
			senderId: 2,
			content: "Hi",
			senderName: "Jane Doe",
		},
		{
			senderId: user?.id,
			content: "How are you?",
			senderName: "John Doe",
		},
		{
			senderId: 2,
			content: "I am fine",
			senderName: "Jane Doe",
		},
		{
			senderId: user?.id,
			content: "What are you doing?",
			senderName: "John Doe",
		},
		{
			senderId: 2,
			content: "I am playing chess",
			senderName: "Jane Doe",
		},
		{
			senderId: user?.id,
			content: "Can I join you?",
			senderName: "John Doe",
		},
		{
			senderId: 2,
			content: "Sure",
			senderName: "Jane Doe",
		},
		{
			senderId: user?.id,
			content: "Where are you?",
			senderName: "John Doe",
		},
		{
			senderId: 2,
			content: "I am at home",
			senderName: "Jane Doe",
		},
		{
			senderId: user?.id,
			content: "I am coming",
			senderName: "John Doe",
		},
		{
			senderId: 2,
			content: "Ok",
			senderName: "Jane Doe",
		},
		{
			senderId: user?.id,
			content: "Bye",
			senderName: "John Doe",
		},
		{
			senderId: 2,
			content: "Bye",
			senderName: "Jane Doe",
		},
		{
			senderId: user?.id,
			content: "Goodnight",
			senderName: "John Doe",
		},
		{
			senderId: 2,
			content: "Goodnight",
			senderName: "Jane Doe",
		},
	]);

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			setMessages([
                ...messages,
                {
                    senderId: user?.id,
                    content: e.target.value,
                    senderName: "You",
                },
            ]);
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
        setMessages([
            ...messages,
            {
                senderId: user?.id,
                content: input.value,
                senderName: "You",
            },
        ]);
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
