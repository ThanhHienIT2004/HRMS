import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import Providers from "../../providers";
import { LoadingProvider } from "./context/loadingContext";
import GlobalLoading from "@/components/loadings/globalLoading";

export const metadata: Metadata = {
	title: "PeopleHub",
	description: "Ứng dụng quản lý nhân sự",
};

export default function RootLayout({children, }: Readonly<{ children: React.ReactNode; }>) {
	return (
		<html lang="vi">
		<body>
		<LoadingProvider>
			<Providers>
				<GlobalLoading />
			{children}
			</Providers>
		</LoadingProvider>
		</body>
		</html>
	);
}