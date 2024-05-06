"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/hook/AuthHook";

const Register = () => {
	const baseUrl = "https://se330-o21-chinese-game-be.onrender.com";
	const router = useRouter();
	const setUser = useSession((state) => state.setUser);
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		password: "",
		confirmPassword: "",
	});
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [confirmMessage, setConfirmMessage] = useState("");
	const [passwordMessage, setPasswordMessage] = useState("");

	useEffect(() => {
		const removeToken = () => {
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
			localStorage.removeItem("user");
		};
		removeToken();
	}, []);

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			setConfirmMessage("Confirm password must be the same as password");
		} else {
			setConfirmMessage("");
			setErrorMessage("");
			setIsLoading(true);
			// handle form submission here
			const { confirmPassword, ...registerData } = formData;

			try {
				const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(registerData),
				});
				console.log(response);
				if (response.ok) {
					const data = await response.json();
					localStorage.setItem("accessToken", data.access_token);
					localStorage.setItem("refreshToken", data.refresh_token);
					localStorage.setItem("user", JSON.stringify(data.data));
					setUser(data.data);
					router.push("/lobby");
				}
                else if(response.status === 409){
                    setErrorMessage("Email already exists");
                }
			} catch (error) {
				setErrorMessage("Something went wrong. Please try again later.");
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		}
	};

	const handleChange = (event) => {
		if (event.target.name === "password" && event.target.value.length < 15) {
			setPasswordMessage("Password must be at least 15 characters long");
		}
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		});
	};

	return (
		<div className="flex flex-row justify-center items-center gap-10 mt-8">
			<Image
				src="/assets/chinese-chess.jpg"
				width={856}
				height={1117}
				className="lg:block box-border hidden w-auto h-[640px]"
				alt="Chinese Chess"
			/>
			<div className="flex flex-col justify-center items-center border-[#A1A0A0] py-12 border w-[400px] h-[640px]">
				<div className="font-black font-permanent-marker text-3xl xl:text-4xl">
					CHINESE CHESS
				</div>

				<div className="w-full">
					<form className="p-10" onSubmit={handleSubmit}>
						<div className="flex flex-col flex-1 gap-4">
							<div className="flex flex-col gap-2">
								<label
									className="font-inter font-medium text-base text-gray-900"
									htmlFor="email"
								>
									Email
								</label>
								<input
									onChange={handleChange}
									placeholder="email@example.com"
									type="email"
									id="email"
									name="email"
									className="border-[#A1A0A0] p-2 border rounded-md"
								/>
							</div>

							<div className="flex flex-col gap-2">
								<label
									className="font-inter font-medium text-base text-gray-900"
									htmlFor="username"
								>
									Username
								</label>
								<input
									onChange={handleChange}
									placeholder="username"
									type="text"
									id="username"
									name="username"
									className="border-[#A1A0A0] p-2 border rounded-md"
								/>
							</div>

							<div className="flex flex-col gap-2">
								<label
									className="font-inter font-medium text-base text-gray-900"
									htmlFor="password"
								>
									Password
								</label>
								<input
									onChange={handleChange}
									placeholder="********"
									type="password"
									id="password"
									name="password"
									className="border-[#A1A0A0] p-2 border rounded-md"
								/>
							</div>

							<div className="flex flex-col gap-2">
								{confirmMessage && (
									<p className="font-inter text-red-600 text-sm">
										{confirmMessage}
									</p>
								)}
								<label
									className="font-inter font-medium text-base text-gray-900"
									htmlFor="confirmPassword"
								>
									Confirm password
								</label>

								<input
									onChange={handleChange}
									placeholder="********"
									type="password"
									id="confirmPassword"
									name="confirmPassword"
									className="border-[#A1A0A0] p-2 border rounded-md"
								/>
							</div>

							{errorMessage && (
								<p className="font-inter text-red-600 text-sm">
									{errorMessage}
								</p>
							)}
							<button
								type="submit"
								className="flex justify-center items-center bg-sky-500 hover:bg-sky-400 disabled:bg-sky-300 p-2 rounded-md text-white disabled:cursor-not-allowed"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<svg
											aria-hidden="true"
											class="inline mr-3 w-4 h-4 text-gray-200 dark:text-gray-600 animate-spin fill-white"
											viewBox="0 0 100 101"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
												fill="currentColor"
											/>
											<path
												d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
												fill="currentFill"
											/>
										</svg>
										<span>Processing...</span>
									</>
								) : (
									"Register"
								)}
							</button>
						</div>
					</form>
					<div className="w-full text-center">
						Have an account?{" "}
						<Link href="/login" className="text-sky-500">
							Log in
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
