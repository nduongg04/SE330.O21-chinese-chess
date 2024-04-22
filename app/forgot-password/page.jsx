import React from "react";

const ForgotPassword = () => {
	// forgot password page
	return (
		<div className="w-100vw h-100vh flex justify-center items-center">
			<div className="flex flex-col gap-2">
				<label
					className="font-inter font-medium text-base text-gray-900"
					htmlFor="email"
				>
					Email
				</label>
				<input
					type="email"
					id="email"
					name="email"
					className="border border-[#A1A0A0] rounded-md p-2 "
					required
					placeholder="example@mail.com"
				/>
			</div>
		</div>
	);
};

export default ForgotPassword;
