import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Leaderboard = () => {
    const router = useRouter();

	const [leaderboards, setLeaderboards] = useState([]);
	useEffect(() => {
		const getLeaderboard = async () => {
			const accessToken = localStorage.getItem("accessToken");
			const refreshToken = localStorage.getItem("refreshToken");

			const baseUrl = "https://se330-o21-chinese-game-be.onrender.com";
			const fetchData = async (accessToken) => {
				try {
					const response = await fetch(`${baseUrl}/api/v1/user/leaderboard`, {
						method: "GET",
						headers: {
							Authorization: "Bearer " + accessToken,
						},
					});
					if (response.status === 403) {
						return null;
					}

					console.log(response);

					const data = await response.json();
					console.log(data);
					return data;
				} catch (error) {
					console.error(error);
				}
			};

			const getAccessToken = async (refreshToken) => {
				try {
					const response = await fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
						method: "GET",
						headers: {
							Authorization: "Bearer " + refreshToken,
						},
					});
					if (response.status === 403) {
						return null;
					}
					const data = await response.json();
					return data.access_token;
				} catch (error) {
					console.error(error);
				}
			};

			const data = await fetchData(accessToken);
			if (data === null) {
				const newAccessToken = await getAccessToken(refreshToken);
				if (newAccessToken === null) {
					router.push("/login");
					return;
				}
				localStorage.setItem("accessToken", newAccessToken);
				const newData = await fetchData(newAccessToken);
				setLeaderboards(newData);
			} else {
				setLeaderboards(data);
			}
		};

		getLeaderboard();
		
	}, []);

	return (
		<div className="flex flex-col overflow-y-auto max-h-full">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50 sticky top-0">
					<tr>
						<th
							scope="col"
							className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Rank
						</th>
						<th
							scope="col"
							className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Player
						</th>
						<th
							scope="col"
							className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Elo
						</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{leaderboards?.map((player, playerIdx) => {
						const rank = playerIdx + 1;
						return (
							<tr key={playerIdx} className="hover:bg-blue-500 group">
								<td className="group-hover:text-white px-6 py-4 whitespace-nowrap">
									{rank <= 3 ? (
										<Image
											width={25}
											height={25}
											src={`/assets/rank${rank}.svg`}
											alt={`Rank ${rank}`}
										/>
									) : (
										rank
									)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap ">
									<div className="text-xs text-gray-900 group-hover:text-white">
										{player.username.substring(0, 15)} ({player.nation})
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 group-hover:text-white">
									{player.elo}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default Leaderboard;
