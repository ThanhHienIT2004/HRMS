import '../globals.css';
import Providers from "../../../providers";
import GlobalLoading from "@/components/loadings/globalLoading";
import React from "react";

export const metadata = {
    title: 'HRMS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <Providers>
                <GlobalLoading />
                { children }
        </Providers>
    );
}
