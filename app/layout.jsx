import { Inter, Permanent_Marker } from "next/font/google";
import "./global.css";
<link rel="icon" href="/favicon.ico" sizes="any" />;
const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

const permanent_maker = Permanent_Marker({
	weight: "400",
	subsets: ["latin"],
	display: "swap",
	variable: "--font-permanent-marker",
});

export const metadata = {
	title: "Chinese Chess",
	description: "Play chinese chess online",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${inter.variable} ${permanent_maker.variable}`}>
				{children}
			</body>
		</html>
	);
}
