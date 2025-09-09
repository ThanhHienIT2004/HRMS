"use client";

import React from "react";
import { X, Trash2 } from "lucide-react";

export default function DeleteDepartmentModal({
                                                  isOpen,
                                                  onClose,
                                                  onConfirm,
                                                  department,
                                              }: any) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-lg font-semibold mb-4 text-red-600">
                    Xóa phòng ban
                </h2>
                <p className="mb-6">
                    Bạn có chắc chắn muốn xóa phòng ban{" "}
                    <span className="font-semibold">{department?.department_name}</span>?
                    Hành động này không thể hoàn tác.
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" /> Xóa
                    </button>
                </div>
            </div>
        </div>
    );
}
