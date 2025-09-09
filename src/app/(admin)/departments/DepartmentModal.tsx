"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface DepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: { department_name: string }) => void;
}

export default function DepartmentModal({
                                            isOpen,
                                            onClose,
                                            onSubmit,
                                        }: DepartmentModalProps) {
    const [name, setName] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        onSubmit({ department_name: name });
        setName("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>

                <h2 className="text-lg font-semibold mb-4">Thêm phòng ban</h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tên phòng ban
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="VD: Nhân sự"
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm rounded-md bg-indigo-500 text-white hover:bg-indigo-600"
                        >
                            Thêm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
