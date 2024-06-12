import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const History = () => {
	const baseUrl = "https://se330-o21-chinese-game-be.onrender.com";
	const router = useRouter();
	const page = 1,
		size = 10;

	const [histories, setHistories] = useState([]);

	useEffect(() => {
		const getHistoryData = async () => {
			const accessToken = localStorage.getItem("accessToken");
			const refreshToken = localStorage.getItem("refreshToken");

			const fetchData = async (accessToken) => {
				try {
					const response = await fetch(
						`${baseUrl}/api/v1/history/find?page=${page}&size=${size}`,
						{
							method: "GET",
							headers: {
								Authorization: "Bearer " + accessToken,
							},
						}
					);
					if (response.status === 403) {
						return null;
					}

					const data = await response.json();
					return data.content;
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
					router.replace("/login");
					return;
				}
				localStorage.setItem("accessToken", newAccessToken);
				const newData = await fetchData(newAccessToken);
				setHistories(newData);
			} else {
				setHistories(data);
			}
		};

		getHistoryData();
	}, []);

	const convertDate = (dateString) => {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	};

	return (
		<div className="flex flex-col h-full min-w-full overflow-hidden">
			<div className="shadow overflow-y-auto border-b border-gray-200 sm:rounded-lg">
				<table className="min-w-full divide-y divide-gray-200 max-h-full">
					<thead className="bg-gray-50 sticky top-0">
						<tr>
							<th
								scope="col"
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Player
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Result
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Date
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200 ">
						{histories?.map((game, gameIdx) => (
							<React.Fragment key={gameIdx}>
								<tr>
									<td className="px-3 py-3 whitespace-nowrap">
										<div className="text-sm text-gray-900">
											{game.user1.username} ({game.user1.elo})
										</div>
										<div className="text-sm text-gray-500">
											{game.user1.nation}
										</div>
									</td>
									<td
										className={
											"px-3 py-3 whitespace-nowrap text-sm  text-gray-500 text-center"
										}
									>
										<div className="text-sm text-gray-500 text-center">
											{game.user1Score}
										</div>
									</td>
									<td
										rowSpan={2}
										className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500"
									>
										{convertDate(game.createdAt)}
									</td>
								</tr>
								<tr>
									<td className="px-3 py-3 whitespace-nowrap">
										<div className="text-sm text-gray-900">
											{game.user2.username} ({game.user2.elo})
										</div>
										<div className="text-sm text-gray-500">
											{game.user2.nation}
										</div>
									</td>
									<td
										className={`"px-3 py-3  whitespace-nowrap text-sm  text-gray-500 text-center"`}
									>
										<div className="text-sm text-gray-500 text-center">
											{game.user2Score}
										</div>
									</td>
								</tr>
							</React.Fragment>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default History;
