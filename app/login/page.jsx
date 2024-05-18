"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/hook/AuthHook";

const Login = () => {
	const setUser = useSession((state) => state.setUser);
	useEffect(() => {
		const getRefreshToken = () => {
			const refreshToken = localStorage.getItem("refreshToken");

			if (refreshToken) {
				const user = JSON.parse(localStorage.getItem("user"));
				console.log(user);
				setUser(user);
				router.push("/lobby");
				return;
			}
		};

		getRefreshToken();
	}, []);

	const baseUrl = "https://se330-o21-chinese-game-be.onrender.com";

	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const router = useRouter();

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		const resultPingSocket = await fetch("https://chinesechess-socket.onrender.com/ping", {
			method: "GET",
		});

        console.log(resultPingSocket)

		try {
			const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			console.log(response);

			if (response.status === 401) {
				setErrorMessage("Invalid email or password. Please try again.");
				return;
			} else if (response.status !== 200) {
				setErrorMessage("Something went wrong. Please try again later.");
				return;
			} else {
				const data = await response.json();
				localStorage.setItem("accessToken", data.access_token);
				localStorage.setItem("refreshToken", data.refresh_token);
				localStorage.setItem("user", JSON.stringify(data.data));
				setUser(data.data);
				router.push("/lobby");
			}
		} catch (error) {
			setErrorMessage("Something went wrong. Please try again later.");
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (event) => {
		setErrorMessage("");
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		});
	};

	return (
		<div className="mt-20 flex flex-row items-center justify-center gap-10">
			<Image
				src="/assets/chinese-chess.jpg"
				width={856}
				height={1117}
				className="hidden h-[500px] w-auto lg:block"
				alt="Chinese Chess"
			/>
			<div className="flex h-[500px] w-[400px] flex-col items-center justify-center border border-[#A1A0A0] py-12">
				<div className="font-permanent-marker text-3xl font-black xl:text-4xl">
					CHINESE CHESS
				</div>

				<div className="w-full">
					<form className="p-10" onSubmit={handleSubmit}>
						<div className="flex flex-1 flex-col gap-4">
							<div className="flex flex-col gap-2">
								<label
									className="font-inter text-base font-medium text-gray-900"
									htmlFor="email"
								>
									Email
								</label>
								<input
									onChange={handleChange}
									type="email"
									id="email"
									name="email"
									value={formData.email}
									className="rounded-md border border-[#A1A0A0] p-2"
									required
									placeholder="email@example.com"
								/>
							</div>

							<div className="flex flex-col gap-2">
								<label
									className="font-inter text-base font-medium text-gray-900"
									htmlFor="password"
								>
									Password
								</label>
								<input
									onChange={handleChange}
									type="password"
									id="password"
									name="password"
									value={formData.password}
									className="rounded-md border border-[#A1A0A0] p-2"
									required
									placeholder="********"
								/>
							</div>

							{/* <Link
								href="/forgot-password"
								className="text-right font-inter text-sm font-semibold hover:text-sky-500"
							>
								Forgot password?
							</Link> */}

							{errorMessage && (
								<span className="font-inter text-sm text-red-500">
									{errorMessage}
								</span>
							)}

							<button
								type="submit"
								className="mt-3 flex items-center justify-center rounded-md bg-sky-500 p-2 text-white hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-sky-300"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<svg
											aria-hidden="true"
											class="mr-3 inline h-4 w-4 animate-spin fill-white text-gray-200 dark:text-gray-600"
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
									"Login"
								)}
							</button>
						</div>
					</form>
					<div className="w-full text-center">
						Don't have an account?{" "}
						<Link href="/register" className="text-sky-500">
							Register
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
