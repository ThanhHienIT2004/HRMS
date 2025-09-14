"use client";

import { useQuery, gql, useMutation } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { Search, Eye, Trash2 } from "lucide-react";
import DetailModal from "@/app/(admin)/timekeeping/DetailModal";
import { useSnackbar } from "notistack";
import { useLoading } from "@/app/context/loadingContext";
import ConfirmDeleteModal from "@/app/(admin)/employees/ConfirmDeleteModal";

const GET_TIMEKEEPINGS = gql`
  query GetTimekeepings($from: String!, $to: String!) {
    timekeepings(from: $from, to: $to) {
      timekeeping_id
      date 
      checkin
      checkout
      work_hours
      leave_hours
      employee {
        employee_id
        full_name
        avatar_url
      }
      workType {
        name
      }
    }
  }
`;

const DELETE_TIMEKEEPING = gql`
  mutation RemoveTimekeeping($id: Int!) {
    removeTimekeeping(id: $id) {
      timekeeping_id
    }
  }
`;

// Badge trạng thái
function StatusBadge({ status }: { status: string }) {
    const base = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
        case "Đúng giờ":
            return <span className={`${base} bg-emerald-50 text-emerald-600`}>{status}</span>;
        case "Đi muộn":
            return <span className={`${base} bg-rose-50 text-rose-600`}>{status}</span>;
        case "Về sớm":
            return <span className={`${base} bg-amber-50 text-amber-600`}>{status}</span>;
        default:
            return <span className={base}>{status}</span>;
    }
}

// Lấy tổng số phút trong ngày từ chuỗi datetime
function getMinutesOfDay(datetimeStr: string): number {
    const timePart = datetimeStr.includes("T")
        ? datetimeStr.split("T")[1]
        : datetimeStr.split(" ")[1];

    const [hh, mm] = timePart.split(":").map(Number);
    return hh * 60 + mm; // ví dụ 08:30 => 510 phút
}

function calcStatus(checkin?: string, checkout?: string) {
    if (!checkin || !checkout) return "-";

    const ciMinutes = getMinutesOfDay(checkin);
    const coMinutes = getMinutesOfDay(checkout);

    if (ciMinutes > 8 * 60) return "Đi muộn"; // sau 08:00
    if (coMinutes < 17 * 60) return "Về sớm"; // trước 17:00
    return "Đúng giờ";
}

// Format giờ (không lệch múi giờ)
function formatTime(value?: string) {
    if (!value) return "-";
    return new Date(value).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
    });
}

// Format ngày
function formatDate(value?: string) {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    });
}

// Lấy khoảng ngày của tháng hiện tại
function getDefaultDateRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
        from: start.toISOString().split("T")[0],
        to: end.toISOString().split("T")[0],
    };
}

export default function TimekeepingPage() {
    const { from: defaultFrom, to: defaultTo } = getDefaultDateRange();
    const [selected, setSelected] = useState<any>(null);
    const [query, setQuery] = useState("");
    const [from, setFrom] = useState(defaultFrom);
    const [to, setTo] = useState(defaultTo);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedToDelete, setSelectedToDelete] = useState<any>(null);
    const { enqueueSnackbar } = useSnackbar();
    const { setLoading } = useLoading();

    const [deleteTimekeeping] = useMutation(DELETE_TIMEKEEPING, {
        refetchQueries: [{ query: GET_TIMEKEEPINGS, variables: { from, to } }],
    });

    const { data, loading, error } = useQuery(GET_TIMEKEEPINGS, {
        variables: { from, to },
    });

    // Đồng bộ trạng thái loading của query với loadingContext
    useEffect(() => {
        setLoading(loading);
    }, [loading, setLoading]);

    const handleDeleteClick = (record: any) => {
        setSelectedToDelete(record);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedToDelete) return;
        try {
            setLoading(true);
            await deleteTimekeeping({ variables: { id: selectedToDelete.timekeeping_id } });
            enqueueSnackbar("Xóa bản ghi chấm công thành công ✅", { variant: "success" });
            setShowDeleteModal(false);
            setSelectedToDelete(null);
        } catch (err) {
            console.error("Delete error:", err);
            enqueueSnackbar("Xóa bản ghi chấm công thất bại ❌", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    if (error) return <p className="text-red-500">Lỗi: {error.message}</p>;

    const records = data?.timekeepings || [];
    const filtered = records.filter((r: any) =>
        r.employee.full_name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#EDEEFF]">
            <main className="mx-auto max-w-7xl px-4 pb-16 pt-6">
                <h1 className="text-xl font-semibold mb-4">Chấm công</h1>

                {/* Thanh công cụ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                    {/* Tìm kiếm */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-2.5 size-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm nhân sự"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full rounded-full bg-white py-2 pl-9 pr-3 text-sm shadow-sm ring-1 ring-black/5 focus:outline-none"
                        />
                    </div>

                    {/* Bộ lọc ngày */}
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="rounded-md border px-2 py-1 text-sm"
                        />
                        <span className="self-center">đến</span>
                        <input
                            type="date"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="rounded-md border px-2 py-1 text-sm"
                        />
                    </div>
                </div>

                {/* Bảng dữ liệu */}
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full text-sm">
                        <thead>
                        <tr className="bg-gray-50 text-left text-gray-600">
                            <th className="px-5 py-3">Ngày</th>
                            <th className="px-5 py-3">Nhân sự</th>
                            <th className="px-5 py-3">Loại công việc</th>
                            <th className="px-5 py-3">Giờ vào</th>
                            <th className="px-5 py-3">Giờ ra</th>
                            <th className="px-5 py-3">Trạng thái</th>
                            <th className="px-5 py-3">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map((r: any) => {
                            const s = calcStatus(r.checkin, r.checkout);
                            return (
                                <tr key={r.timekeeping_id} className="border-t hover:bg-gray-50">
                                    <td className="px-5 py-3">{formatDate(r.date)}</td>
                                    <td className="px-5 py-3 flex items-center gap-2">
                                        <img
                                            src={r.employee.avatar_url || "https://i.pravatar.cc/40"}
                                            className="size-8 rounded-full"
                                        />
                                        <span>{r.employee.full_name}</span>
                                    </td>
                                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs">
                        {r.workType?.name || "-"}
                      </span>
                                    </td>
                                    <td className="px-5 py-3">{formatTime(r.checkin)}</td>
                                    <td className="px-5 py-3">{formatTime(r.checkout)}</td>
                                    <td className="px-5 py-3">
                                        <StatusBadge status={s} />
                                    </td>
                                    <td className="px-5 py-3 flex gap-2">
                                        <button
                                            onClick={() => setSelected(r)}
                                            className="p-2 hover:bg-gray-100 rounded-full"
                                        >
                                            <Eye className="size-4 text-gray-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(r)}
                                            className="p-2 hover:bg-gray-100 rounded-full"
                                        >
                                            <Trash2 className="size-4 text-rose-600" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    {selected && <DetailModal record={selected} onClose={() => setSelected(null)} />}
                    {showDeleteModal && (
                        <ConfirmDeleteModal
                            open={showDeleteModal}
                            onClose={() => setShowDeleteModal(false)}
                            onConfirm={confirmDelete}
                        />
                    )}
                </div>

                {/* Phân trang giả */}
                <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                    <div>Hiển thị {filtered.length} bản ghi</div>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map((p) => (
                            <button
                                key={p}
                                className="px-3 py-1 rounded-md border text-gray-600 hover:bg-gray-100"
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}