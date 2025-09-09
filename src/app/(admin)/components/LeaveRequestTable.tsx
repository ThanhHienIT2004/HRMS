"use client";

import React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Check } from "lucide-react";
import { Card, CardHeader } from "./Card";
import { Badge } from "./Badge";
import { formatDate } from "../utils/format";
import { ActionButton } from "@/app/(admin)/components/IconButtons";

// ======================
// GraphQL Query & Mutation
// ======================
const GET_LEAVE_REQUESTS = gql`
  query GetLeaves {
    getLeaves {
      leave_id
      reason
      status
      start_date
      end_date
      employee {
        employee_id
        full_name
        avatar_url
      }
      leaveType {
        name
      }
    }
  }
`;

const UPDATE_LEAVE = gql`
  mutation UpdateLeave($id: Float!, $data: UpdateLeaveInput!) {
    updateLeave(id: $id, data: $data) {
      leave_id
      status
    }
  }
`;

// ======================
// Component
// ======================
export const LeaveRequestTable = () => {
    const { data, loading, error, refetch } = useQuery(GET_LEAVE_REQUESTS);
    const [updateLeave] = useMutation(UPDATE_LEAVE);

    if (loading) return <p className="p-4">Đang tải dữ liệu...</p>;
    if (error) return <p className="p-4 text-red-500">Lỗi: {error.message}</p>;

    const handleUpdate = async (id: number, status: string) => {
        try {
            await updateLeave({
                variables: {
                    id: id * 1.0, // ép về Float
                    data: { status: status.toUpperCase() }, // gửi APPROVED/REJECTED
                },
            });
            await refetch(); // reload lại bảng
        } catch (err: any) {
            console.error(err);
        }
    };

    const leaveRequests =
        data?.getLeaves?.map((leave: any) => ({
            id: leave.leave_id,
            employeeId: leave.employee.employee_id,
            name: leave.employee.full_name,
            avatar: leave.employee.avatar_url ?? "/default-avatar.png",
            type: leave.leaveType?.name ?? "Khác",
            from: leave.start_date,
            to: leave.end_date,
            reason: leave.reason,
            status: leave.status.toLowerCase(), // pending/approved/rejected
        })) ?? [];

    return (
        <Card>
            <CardHeader>
                <div className="text-lg font-semibold">Danh sách đơn xin nghỉ</div>
                <div className="text-sm text-gray-500">Hôm nay</div>
            </CardHeader>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                    <tr className="bg-gray-50 text-left text-gray-600">
                        <th className="px-5 py-3 font-medium">Mã nhân viên</th>
                        <th className="px-5 py-3 font-medium">Tên nhân viên</th>
                        <th className="px-5 py-3 font-medium">Loại nghỉ</th>
                        <th className="px-5 py-3 font-medium">Từ ngày</th>
                        <th className="px-5 py-3 font-medium">Đến ngày</th>
                        <th className="px-5 py-3 font-medium">Lý do</th>
                        <th className="px-5 py-3 font-medium">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {leaveRequests.map((r) => (
                        <tr key={r.id} className="border-t">
                            <td className="px-5 py-4 text-gray-700">{r.employeeId}</td>
                            <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <img src={r.avatar} className="size-8 rounded-full" />
                                    <div>
                                        <div className="font-medium">{r.name}</div>
                                        <div className="text-xs text-gray-500">ID: {r.id}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-5 py-4 text-gray-700">{r.type}</td>
                            <td className="px-5 py-4 text-gray-700">{formatDate(r.from)}</td>
                            <td className="px-5 py-4 text-gray-700">{formatDate(r.to)}</td>
                            <td className="px-5 py-4 text-gray-700">{r.reason}</td>
                            <td className="px-5 py-4">
                                {r.status === "pending" ? (
                                    <div className="flex items-center gap-2">
                                        <ActionButton
                                            variant="primary"
                                            onClick={() => handleUpdate(r.id, "APPROVED")}
                                        >
                                            <Check className="mr-1 inline size-3" /> Chấp nhận
                                        </ActionButton>
                                        <ActionButton
                                            variant="danger"
                                            onClick={() => handleUpdate(r.id, "REJECTED")}
                                        >
                                            ✕ Từ chối
                                        </ActionButton>
                                    </div>
                                ) : (
                                    <Badge intent={r.status === "approved" ? "success" : "danger"}>
                                        {r.status === "approved" ? "Đã chấp nhận" : "Đã từ chối"}
                                    </Badge>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
