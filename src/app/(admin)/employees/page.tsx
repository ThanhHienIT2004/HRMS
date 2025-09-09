"use client";

import React, { useState, useEffect } from "react";
import { Search, Eye, Trash2, Plus, Filter, Pencil } from "lucide-react";
import { CardContent } from "@mui/material";
import { Card } from "@/app/(admin)/components/Card";
import { gql, useMutation, useQuery } from "@apollo/client";
import EmployeeDetailModal from "@/app/(admin)/employeeDetail/employee-detail";
import EmployeeCreateModal from "@/app/(admin)/employees/EmployeeCreateModal";
import EmployeeEditModal from "@/app/(admin)/employees/EmployeeEditModal";
import ConfirmDeleteModal from "@/app/(admin)/employees/ConfirmDeleteModal";
import { useSnackbar } from "notistack";
import { useLoading } from "@/app/context/loadingContext";

// Query
const GET_EMPLOYEES = gql`
  query GetEmployees {
    getEmployees {
      employee_id
      full_name
      dob
      gender
      place_of_birth
      hometown
      nationality
      ethnicity
      religion
      marital_status
      health_status
      avatar_url
      positionAssignments {
        active
        department {
          department_id
          department_name
        }
        position {
          position_id
          position_name
        }
      }
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: String!) {
    deleteEmployee(id: $id)
  }
`;

export default function EmployeesPage() {
    const [query, setQuery] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const { setLoading } = useLoading();
    const { data, loading, error } = useQuery(GET_EMPLOYEES);
    const [editingEmployee, setEditingEmployee] = useState<any>(null);
    const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
        refetchQueries: ["GetEmployees"],
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedToDelete, setSelectedToDelete] = useState<any>(null);

    // Đồng bộ trạng thái loading của query với loadingContext
    useEffect(() => {
        setLoading(loading);
    }, [loading, setLoading]);

    const handleDeleteClick = (emp: any) => {
        setSelectedToDelete(emp);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedToDelete) return;
        try {
            setLoading(true);
            await deleteEmployee({ variables: { id: selectedToDelete.employee_id } });
            enqueueSnackbar("Xóa nhân sự thành công ✅", { variant: "success" });
            setShowDeleteModal(false);
            setSelectedToDelete(null);
        } catch (err) {
            console.error("Delete error:", err);
            enqueueSnackbar("Xóa nhân sự thất bại ❌", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    if (error) return <p>Lỗi: {error.message}</p>;

    const employees = data?.getEmployees || [];
    const filtered = employees.filter(
        (e: any) =>
            e.full_name?.toLowerCase().includes(query.toLowerCase()) ||
            e.employee_id.includes(query) ||
            e.positionAssignments?.some(
                (pa: any) => pa.department?.department_name?.toLowerCase().includes(query.toLowerCase())
            )
    );

    return (
        <div className="min-h-screen bg-[#EDEEFF]">
            <main className="mx-auto max-w-7xl px-4 pb-16 pt-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Tất cả nhân sự</h1>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                    {/* Search */}
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

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-white shadow"
                            style={{ background: "linear-gradient(to right, #B8C2FF 0%, #6183FF 100%)" }}
                        >
                            <Plus className="size-4" /> Thêm nhân sự
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow ring-1 ring-gray-200 hover:bg-gray-50">
                            <Filter className="size-4" /> Lọc
                        </button>
                    </div>
                    {showCreateModal && (
                        <EmployeeCreateModal
                            onClose={() => setShowCreateModal(false)}
                            onCreated={(newEmp: any) => {
                                enqueueSnackbar("Thêm nhân sự thành công ✅", { variant: "success" });
                                console.log("Created:", newEmp);
                            }}
                        />
                    )}
                </div>

                {/* Table */}
                <Card>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                <tr className="bg-gray-50 text-left text-gray-600">
                                    <th className="px-5 py-3">Avatar</th>
                                    <th className="px-5 py-3">Tên nhân sự</th>
                                    <th className="px-5 py-3">ID</th>
                                    <th className="px-5 py-3">Ngày sinh</th>
                                    <th className="px-5 py-3">Giới tính</th>
                                    <th className="px-5 py-3">Phòng</th>
                                    <th className="px-5 py-3">Vị trí</th>
                                    <th className="px-5 py-3">Hành động</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filtered.map((emp: any) => (
                                    <tr key={emp.employee_id} className="border-t">
                                        <td className="px-5 py-3">
                                            <img
                                                src={emp.avatar_url || "https://i.pravatar.cc/40"}
                                                className="size-8 rounded-full"
                                            />
                                        </td>
                                        <td className="px-5 py-3">{emp.full_name}</td>
                                        <td className="px-5 py-3">{emp.employee_id}</td>
                                        <td className="px-5 py-3">
                                            {emp.dob ? new Date(emp.dob).toLocaleDateString() : "-"}
                                        </td>
                                        <td className="px-5 py-3">
                                            {emp.gender === "MALE"
                                                ? "Nam"
                                                : emp.gender === "FEMALE"
                                                    ? "Nữ"
                                                    : emp.gender === "other"
                                                        ? "Khác"
                                                        : "-"}
                                        </td>
                                        <td className="px-5 py-3">
                                            {Array.from(
                                                new Set(
                                                    emp.positionAssignments
                                                        ?.filter((pa: any) => pa.active)
                                                        .map((pa: any) => pa.department?.department_name)
                                                )
                                            ).join(", ") || "-"}
                                        </td>
                                        <td className="px-5 py-3">
                                            {emp.positionAssignments
                                                ?.filter((pa: any) => pa.active)
                                                .map((pa: any) => pa.position?.position_name)
                                                .join(", ") || "-"}
                                        </td>
                                        <td className="px-5 py-3 flex gap-2">
                                            <button
                                                onClick={() => setSelectedEmployee(emp)}
                                                className="p-2 hover:bg-gray-100 rounded-full"
                                            >
                                                <Eye className="size-4 text-gray-600" />
                                            </button>
                                            <button
                                                onClick={() => setEditingEmployee(emp)}
                                                className="p-2 hover:bg-gray-100 rounded-full"
                                            >
                                                <Pencil className="size-4 text-green-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(emp)}
                                                className="p-2 hover:bg-gray-100 rounded-full"
                                            >
                                                <Trash2 className="size-4 text-rose-600" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {selectedEmployee && (
                    <EmployeeDetailModal
                        employee={selectedEmployee}
                        onClose={() => setSelectedEmployee(null)}
                    />
                )}
                {editingEmployee && (
                    <EmployeeEditModal
                        employee={editingEmployee}
                        onClose={() => setEditingEmployee(null)}
                        onUpdated={(updatedEmp: any) => {
                            enqueueSnackbar("Cập nhật nhân sự thành công ✅", { variant: "success" });
                        }}
                    />
                )}
                {showDeleteModal && (
                    <ConfirmDeleteModal
                        open={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={confirmDelete}
                    />
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                    <div>
                        Showing {filtered.length} of {employees.length} records
                    </div>
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