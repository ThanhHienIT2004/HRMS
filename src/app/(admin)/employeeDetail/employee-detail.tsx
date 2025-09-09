import React from "react";
import { X } from "lucide-react";

function EmployeeDetailModal({ employee, onClose }: any) {
    if (!employee) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-4 mb-6">
                    <img
                        src={employee.avatar_url || "https://i.pravatar.cc/80"}
                        className="w-16 h-16 rounded-full"
                    />
                    <div>
                        <h2 className="text-xl font-semibold">{employee.full_name}</h2>
                        <p className="text-gray-500">{employee.employee_id}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Ngày sinh:</strong> {employee.dob ? new Date(employee.dob).toLocaleDateString("vi-VN") : "-"}</div>
                    <div><strong>Giới tính:</strong> {employee.gender || "-"}</div>
                    <div><strong>Nơi sinh:</strong> {employee.place_of_birth || "-"}</div>
                    <div><strong>Quê quán:</strong> {employee.hometown || "-"}</div>
                    <div><strong>Quốc tịch:</strong> {employee.nationality || "-"}</div>
                    <div><strong>Dân tộc:</strong> {employee.ethnicity || "-"}</div>
                    <div><strong>Tôn giáo:</strong> {employee.religion || "-"}</div>
                    <div><strong>Tình trạng hôn nhân:</strong> {employee.marital_status || "-"}</div>
                    <div><strong>Tình trạng sức khỏe:</strong> {employee.health_status || "-"}</div>
                </div>

                <div className="mt-6">
                    <h3 className="font-semibold">Phòng ban</h3>
                    <ul className="list-disc ml-6 text-sm">
                        {employee.positionAssignments?.filter((pa: any) => pa.active).length > 0 ? (
                            Array.from(
                                new Set(
                                    employee.positionAssignments
                                        .filter((pa: any) => pa.active)
                                        .map((pa: any) => pa.department?.department_name)
                                )
                            ).map((dept: any, idx: number) => (
                                <li key={idx}>{dept}</li>
                            ))
                        ) : (
                            <li>-</li>
                        )}
                    </ul>
                </div>


                <div className="mt-4">
                    <h3 className="font-semibold">Chức vụ</h3>
                    <ul className="list-disc ml-6 text-sm">
                        {employee.positionAssignments?.filter((pa: any) => pa.active).length > 0 ? (
                            employee.positionAssignments
                                .filter((pa: any) => pa.active) // 👈 chỉ lấy active
                                .map((pa: any, idx: number) => (
                                    <li key={idx}>
                                        {pa.position?.position_name} - {pa.department?.department_name}
                                    </li>
                                ))
                        ) : (
                            <li>-</li>
                        )}
                    </ul>
                </div>

            </div>
        </div>
    );
}

export default EmployeeDetailModal;
