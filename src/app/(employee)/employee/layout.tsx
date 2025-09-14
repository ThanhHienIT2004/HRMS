import { TopNav } from "@/app/(admin)/components/TopNav";
import React from "react";
import {ToastContainer} from "react-toastify";
import ProtectedLayout from "@/app/(admin)/protectedLayout";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <ProtectedLayout>
            <main>{children}</main>
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
            </ProtectedLayout>

        </div>
    );
}
