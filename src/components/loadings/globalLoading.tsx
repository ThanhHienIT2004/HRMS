// src/app/components/GlobalLoading.tsx
'use client';

import { useLoading } from "@/app/context/loadingContext";

const GlobalLoading = () => {
    const { isLoading } = useLoading();

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <div
                className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300"
                style={{ borderTopColor: "#6183FF", borderRightColor: "#B8C2FF" }}
            ></div>
            <p className="mt-4 text-white text-lg">Đang tải...</p>
        </div>
    );
};

export default GlobalLoading;