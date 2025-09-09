import { TopNav } from "@/app/(admin)/components/TopNav";
import React from "react";
import {ToastContainer} from "react-toastify";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <TopNav />
            <main>{children}</main>
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        </div>
    );
}
