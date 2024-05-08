"use client";

import { useState, useRef } from "react";

const Page = ({ params }) => {
	const email = decodeURIComponent(params.email);

	return (
		<div className="w-full h-[100vh] min-w-[600px] flex items-center flex-col bg-gray-200">
			<div className="py-3 px-3 h-[300px] min-w-[600px]  flex flex-col gap-2 mt-28 justify-center items-center bg-white rounded-lg shadow-md shadow-slate-400/50">
				<label
					className="font-inter font-medium self-start text-gray-900 text-lg"
					htmlFor="email"
				>
					Enter your email address
				</label>
				<div className="flex justify-center gap-2">
					{[...Array(6)].map((_, i) => (
						<input
							key={i}
							type="text"
							maxLength="1"
							className="w-16 h-20 border-2 text-lg font-semibold border-gray-300 rounded text-center"
							value={code[i]}
							onChange={handleChange(i)}
							ref={(ref) => (inputsRef.current[i] = ref)}
                            onKeyDown={handleKeyDown(i)}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default Page;
