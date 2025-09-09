"use client";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function ConfirmDeleteModal({ open, onClose, onConfirm }: any) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-rose-100 text-rose-600 p-3 rounded-full">
                        <Trash2 className="size-6" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Xóa nhân sự
                    </h2>
                </div>

                <p className="mt-4 text-gray-600 text-sm">
                    Bạn có chắc chắn muốn xóa nhân sự này không? Hành động này
                    <span className="text-rose-600 font-medium"> không thể hoàn tác</span>.
                </p>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-500 shadow"
                    >
                        Xóa
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
