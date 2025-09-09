"use client";

import React, { useState, useEffect } from "react";
import { Search, PlusCircle, ChevronRight, Trash2 } from "lucide-react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useLoading } from "@/app/context/loadingContext";

// ================= GraphQL =================
const GET_DEPARTMENTS = gql`
  query {
    departments {
      department_id
      department_name
      positionAssignments {
        employee {
          employee_id
          full_name
          avatar_url
        }
        position {
          position_name
        }
      }
    }
  }
`;

const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(createDepartmentInput: $input) {
      department_id
      department_name
    }
  }
`;

const REMOVE_DEPARTMENT = gql`
  mutation RemoveDepartment($id: String!) {
    removeDepartment(department_id: $id) {
      department_id
    }
  }
`;

// ================= Modal thêm =================
function DepartmentCreateModal({ onClose }: { onClose: () => void }) {
    const [name, setName] = useState("");
    const { setLoading } = useLoading();
    const [createDepartment, { loading }] = useMutation(CREATE_DEPARTMENT, {
        refetchQueries: [GET_DEPARTMENTS],
    });

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.warn("Tên phòng ban không được để trống ❌");
            return;
        }
        try {
            setLoading(true);
            await createDepartment({ variables: { input: { department_name: name } } });
            toast.success("Thêm phòng ban thành công ✅");
            onClose();
        } catch (err) {
            toast.error("Thêm phòng ban thất bại ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Thêm phòng ban mới</h2>
                <input
                    type="text"
                    placeholder="Tên phòng ban"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded px-3 py-2 mb-4"
                />
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 rounded text-white"
                        style={{ background: "linear-gradient(to right, #B8C2FF 0%, #6183FF 100%)" }}
                    >
                        {loading ? "Đang thêm..." : "Thêm"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ================= Modal xóa =================
function ConfirmDeleteModal({ id, onClose }: { id: string; onClose: () => void }) {
    const { setLoading } = useLoading();
    const [removeDepartment, { loading }] = useMutation(REMOVE_DEPARTMENT, {
        refetchQueries: [GET_DEPARTMENTS],
    });

    const handleDelete = async () => {
        try {
            setLoading(true);
            await removeDepartment({ variables: { id } });
            toast.success("Xóa phòng ban thành công ✅");
            onClose();
        } catch (err) {
            toast.error("Xóa phòng ban thất bại ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Xác nhận xóa</h2>
                <p>Bạn có chắc chắn muốn xóa phòng ban này?</p>
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">
                        Hủy
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="px-4 py-2 rounded text-white"
                        style={{ background: "linear-gradient(to right, #B8C2FF 0%, #6183FF 100%)" }}
                    >
                        {loading ? "Đang xóa..." : "Xóa"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ================= Page =================
export default function DepartmentsPage() {
    const [query, setQuery] = useState("");
    const { data, loading, error } = useQuery(GET_DEPARTMENTS);
    const [showCreate, setShowCreate] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const { setLoading } = useLoading();

    // Đồng bộ trạng thái loading của query với loadingContext
    useEffect(() => {
        setLoading(loading);
    }, [loading, setLoading]);

    if (error) return <div className="p-6 text-red-500">Lỗi: {error.message}</div>;

    const departments = data?.departments || [];
    const filtered = departments.filter((d: any) =>
        d.department_name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#EDEEFF]">
            <main className="mx-auto max-w-7xl px-4 pb-16 pt-6">
                <h1 className="text-xl font-semibold mb-4">Tất cả phòng ban</h1>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-2.5 size-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm phòng ban"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full rounded-full bg-white py-2 pl-9 pr-3 text-sm shadow-sm ring-1 ring-black/5 focus:outline-none"
                        />
                    </div>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 rounded-full text-white px-4 py-2 text-sm shadow"
                        style={{ background: "linear-gradient(to right, #B8C2FF 0%, #6183FF 100%)" }}
                    >
                        <PlusCircle className="size-4" /> Thêm phòng ban
                    </button>
                </div>

                {/* Grid Departments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filtered.map((dept: any) => (
                        <div key={dept.department_id} className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="font-medium">{dept.department_name}</h2>
                                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {dept.positionAssignments.length} Nhân sự
                  </span>
                                    <button
                                        onClick={() => setDeleteId(dept.department_id)}
                                        className="text-rose-500 hover:underline text-xs flex items-center gap-1"
                                    >
                                        <Trash2 className="size-3" /> Xóa
                                    </button>
                                </div>
                            </div>
                            <ul className="space-y-3">
                                {dept.positionAssignments.map((pa: any, i: number) => (
                                    <li key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={pa.employee.avatar_url || "https://i.pravatar.cc/40"}
                                                className="size-8 rounded-full"
                                            />
                                            <div>
                                                <p className="text-sm font-medium">{pa.employee.full_name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {pa.position?.position_name || "Chưa có chức vụ"}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="size-4 text-gray-400" />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Modal thêm & xóa */}
                {showCreate && <DepartmentCreateModal onClose={() => setShowCreate(false)} />}
                {deleteId && <ConfirmDeleteModal id={deleteId} onClose={() => setDeleteId(null)} />}
            </main>
        </div>
    );
}