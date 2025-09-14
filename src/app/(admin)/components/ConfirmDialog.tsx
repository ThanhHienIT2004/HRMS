"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

interface ConfirmLeaveModalProps {
    open: boolean;
    type: "approve" | "reject"; // loại hành động
    onClose: () => void;
    onConfirm: () => void;
}

export default function ConfirmLeaveModal({
                                              open,
                                              type,
                                              onClose,
                                              onConfirm,
                                          }: ConfirmLeaveModalProps) {
    const isApprove = type === "approve";

    const title = isApprove ? "Chấp nhận đơn nghỉ" : "Từ chối đơn nghỉ";
    const message = isApprove
        ? "Bạn có chắc chắn muốn chấp nhận đơn nghỉ này không?"
        : "Bạn có chắc chắn muốn từ chối đơn nghỉ này không?";
    const confirmText = isApprove ? "Chấp nhận" : "Từ chối";

    const colorClass = isApprove
        ? "bg-emerald-100 text-emerald-600"
        : "bg-rose-100 text-rose-600";
    const buttonClass = isApprove
        ? "bg-emerald-600 hover:bg-emerald-500"
        : "bg-rose-600 hover:bg-rose-500";

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`${colorClass} p-3 rounded-full`}>
                                {isApprove ? (
                                    <CheckCircle className="size-6" />
                                ) : (
                                    <XCircle className="size-6" />
                                )}
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                        </div>

                        <p className="mt-4 text-gray-600 text-sm">{message}</p>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={onConfirm}
                                className={`px-4 py-2 rounded-lg text-white shadow transition ${buttonClass}`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
