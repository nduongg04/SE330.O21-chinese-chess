"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
	const [isEnabled, setIsEnabled] = useState(false);
	const [email, setEmail] = useState("");
	const router = useRouter();

	const handleKeyDown = (e) => {
		if (e.target.value === "") return;

		if (e.key === "Enter") {
			// push to [email]
			router.push(`/forgot-password/${e.target.value}`);
		}
	};

	const handleClick = () => {
		// push to [email]
		if (email !== "") router.push(`/forgot-password/${email}`);
	};

	// forgot password page
	return (
		<div className="w-full h-[100vh] min-w-[600px] flex items-center flex-col bg-gray-200">
			<div className="py-3 px-3 h-[300px] min-w-[600px]  flex flex-col gap-2 mt-28 justify-center items-center bg-white rounded-lg shadow-md shadow-slate-400/50">
				<label
					className="font-inter font-medium self-start text-gray-900 text-lg"
					htmlFor="email"
				>
					Enter your email address
				</label>
				<input
					value={email}
					onChange={(e) => {
						setEmail(e.target.value);
						if (e.target.value === "") {
							setIsEnabled(false);
						} else {
							setIsEnabled(true);
						}
					}}
					onKeyDown={handleKeyDown}
					type="email"
					id="email"
					name="email"
					className="w-full border border-[#A1A0A0] rounded-md p-2 text-lg"
					required
					placeholder="example@mail.com"
				/>

				<button
					onClick={handleClick}
					isEnabled={isEnabled}
					className={
						"w-32 self-end py-2 px-3 bg-cyan-500 text-white text-sm font-semibold rounded-md shadow-lg shadow-cyan-500/50 focus:outline-none mt-4 " +
						(isEnabled ? "cursor-pointer" : "cursor-not-allowed")
					}
				>
					Send
				</button>
			</div>
		</div>
	);
};

export default ForgotPassword;
