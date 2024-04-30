"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import {useSession} from "@/hook/AuthHook"
const Home = () => {
	const baseUrl = "https://se330-o21-chinese-game-be.onrender.com";
	const setUser = useSession((state)=> state.setUser)
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	useEffect(() => {
		const checkAuth = async () => {
			setIsLoading(true);
			const refreshToken = localStorage.getItem("refreshToken");
			if (!refreshToken) {
				setTimeout(() => {
                    setIsLoading(false);
                    router.push("/login");
                }, 3300);
				return;
			}
			try {
				const response = await fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
					method: "GET",
					headers: {
						Authorization: "Bearer " + refreshToken,
					},
				});
				if (response.status !== 200) {
					setTimeout(() => {
						setIsLoading(false);
						router.push("/login");
					}, 3300);
					return;
				} else {
					const data = await response.json();
					localStorage.setItem("accessToken", data.access_token);
					console.log(data);
					setTimeout(() => {
						setUser(data.data)
						setIsLoading(false);
						router.push("/lobby");
					}, 3300);
				}
			} catch (error) {
				console.log(error);
				router.push("/login");
			}
		};

		checkAuth();
	}, []);

	return (
		<div className="w-dvw h-dvh bg-black">{isLoading ? <Loading /> : null}</div>
	);
};

export default Home;
