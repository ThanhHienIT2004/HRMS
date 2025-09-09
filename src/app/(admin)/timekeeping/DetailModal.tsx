import React from "react";

// Định dạng giờ (giữ nguyên UTC, không lệch múi giờ)
function formatTime(value?: string) {
    if (!value) return "-";
    return new Date(value).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
    });
}

// Định dạng ngày
function formatDate(value?: string) {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    });
}
function getMinutesOfDay(datetimeStr: string): number {
    const timePart = datetimeStr.includes("T")
        ? datetimeStr.split("T")[1]
        : datetimeStr.split(" ")[1];

    const [hh, mm] = timePart.split(":").map(Number);
    return hh * 60 + mm; // ví dụ 08:30 => 510 phút
}
// Tính trạng thái
function calcStatus(checkin?: string, checkout?: string) {
    if (!checkin || !checkout) return "-";

    const ciMinutes = getMinutesOfDay(checkin);
    const coMinutes = getMinutesOfDay(checkout);

    if (ciMinutes > 8 * 60) return "Đi muộn"; // sau 08:00
    if (coMinutes < 17 * 60) return "Về sớm"; // trước 17:00
    return "Đúng giờ";
}

// Form

interface DetailModalProps {
    record: any;
    onClose: () => void;
}

export default function DetailModal({ record, onClose }: DetailModalProps) {
    if (!record) return null;

    const status = calcStatus(record.checkin, record.checkout);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                <h2 className="text-lg font-semibold mb-4">Chi tiết chấm công</h2>

                <div className="space-y-3 text-sm">
                    {/* Thông tin nhân sự */}
                    <div className="flex items-center gap-3">
                        <img
                            src={record.employee.avatar_url || "https://i.pravatar.cc/80"}
                            alt={record.employee.full_name}
                            className="w-12 h-12 rounded-full border"
                        />
                        <div>
                            <p className="font-medium">{record.employee.full_name}</p>
                            <span className="text-xs text-gray-500">
                {record.employee.employee_id}
              </span>
                        </div>
                    </div>

                    {/* Chi tiết chấm công */}
                    <p><b>Ngày:</b> {formatDate(record.date)}</p>

                    <p>
                        <b>Loại công việc:</b>
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs">
              {record.workType?.name || "-"}
            </span>
                    </p>

                    <p><b>Giờ vào:</b> {formatTime(record.checkin)}</p>
                    <p><b>Giờ ra:</b> {formatTime(record.checkout)}</p>

                    <p>
                        <b>Trạng thái:</b>
                        <span
                            className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                status === "Đúng giờ"
                                    ? "bg-green-50 text-green-600"
                                    : status === "Đi muộn"
                                        ? "bg-red-50 text-red-600"
                                        : "bg-amber-50 text-amber-600"
                            }`}
                        >
              {status}
            </span>
                    </p>

                    <p><b>Số giờ làm:</b> {record.work_hours ?? 0} giờ</p>
                    <p><b>Số giờ nghỉ:</b> {record.leave_hours ?? 0} giờ</p>
                </div>

                {/* Nút đóng */}
                <div className="mt-5 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
