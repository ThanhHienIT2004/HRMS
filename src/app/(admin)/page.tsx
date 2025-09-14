"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { motion } from "framer-motion";
import { differenceInMinutes, parseISO, setHours, setMinutes } from "date-fns";
import { CircleUserRound, Clock3, ThumbsDown, ThumbsUp, Search } from "lucide-react";
import { KPIStatCard } from "./components/KPIStatCard";
import { EmployeesDonut } from "./components/EmployeesDonut";
import { LeaveRequestTable } from "./components/LeaveRequestTable";
import { Toast } from "./components/Toast";
import { EarlyRisersCard, LateArrivalsCard, MissingPunchCard } from "./components/Card";

// ================== GraphQL Queries ==================
const GET_EMPLOYEES = gql`
  query GetEmployees {
    getEmployees {
      employee_id
      full_name
      gender
      avatar_url
      positionAssignments {
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

const GET_TIMEKEEPINGS = gql`
  query GetTimekeepings {
    timekeepings {
      timekeeping_id
      date
      checkin
      checkout
      employee {
        employee_id
        full_name
        avatar_url
      }
    }
  }
`;

const GET_LEAVES = gql`
  query GetLeaves {
    getLeaves {
      leave_id
      status
      start_date
      end_date
      reason
      employee {
        employee_id
        full_name
      }
      leaveType {
        name
      }
    }
  }
`;

// ================== Helpers ==================
function formatMinutes(mins: number): string {
    if (mins < 60) return `${mins} phút`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
}

function formatTime(value?: Date) {
    if (!value) return "-";
    return new Date(value).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

// ================== Component ==================
export default function HRMSDashboard() {
    const [query, setQuery] = useState("");
    const [requests, setRequests] = useState<any[]>([]);
    const [toast, setToast] = useState<string | null>(null);

    const { data: employeesData } = useQuery(GET_EMPLOYEES);
    const { data: timekeepingsData } = useQuery(GET_TIMEKEEPINGS);
    const { data: leavesData } = useQuery(GET_LEAVES);

    const employees = employeesData?.getEmployees || [];
    const timekeepings = timekeepingsData?.timekeepings || [];
    const leaves = leavesData?.getLeaves || [];

    // Sync leaves → requests
    useEffect(() => {
        if (leaves.length) {
            setRequests(
                leaves.map((lv: any) => ({
                    id: lv.leave_id,
                    name: lv.employee.full_name,
                    employeeId: lv.employee.employee_id,
                    type: lv.leaveType.name,
                    status: lv.status,
                }))
            );
        }
    }, [leaves]);

    // KPI: tổng số đơn xin nghỉ
    const leaveApply = leaves.length;

    // ================== Timekeeping classification ==================
    const { earlyRisers, lateArrivals, missingPunch } = useMemo(() => {
        const e: any[] = [];
        const l: any[] = [];
        const m: any[] = [];

        timekeepings.forEach((tk: any) => {
            const checkin = tk.checkin ? new Date(tk.checkin) : null;
            const checkout = tk.checkout ? new Date(tk.checkout) : null;

            if (!checkin || !checkout) {
                m.push({
                    id: tk.employee.employee_id,
                    name: tk.employee.full_name,
                    avatar: tk.employee.avatar_url?.trim() || "/default-avatar.png",
                    action: !checkin ? "Chưa checkin" : "Chưa checkout",
                });
                return;
            }

            const workDate = parseISO(tk.date);
            const standardCheckin = setMinutes(setHours(workDate, 15), 0); // 08:00

            const diff = differenceInMinutes(checkin, standardCheckin);
            if (diff < 0) {
                e.push({
                    id: tk.employee.employee_id,
                    name: tk.employee.full_name,
                    avatar: tk.employee.avatar_url?.trim() || "/default-avatar.png",
                    timeFormatted: formatMinutes(Math.abs(diff)),
                    checkin: formatTime(checkin),
                });
            } else if (diff > 0) {
                l.push({
                    id: tk.employee.employee_id,
                    name: tk.employee.full_name,
                    avatar: tk.employee.avatar_url?.trim() || "/default-avatar.png",
                    delayFormatted: formatMinutes(diff),
                    checkin: formatTime(checkin),
                });
            }
        });

        return { earlyRisers: e, lateArrivals: l, missingPunch: m };
    }, [timekeepings]);

    // ================== Filters ==================
    const filteredEarlyRisers = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) return earlyRisers;
        return earlyRisers.filter(
            (r: any) => r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
        );
    }, [query, earlyRisers]);

    const filteredLateArrivals = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) return lateArrivals;
        return lateArrivals.filter(
            (r: any) => r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
        );
    }, [query, lateArrivals]);

    const filteredMissingPunch = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) return missingPunch;
        return missingPunch.filter(
            (r: any) =>
                r.name.toLowerCase().includes(q) ||
                r.id.toLowerCase().includes(q) ||
                r.action.toLowerCase().includes(q)
        );
    }, [query, missingPunch]);

    // ================== KPI numbers ==================
    const attendance = new Set(
        timekeepings.filter((tk: any) => tk.checkin).map((tk: any) => tk.employee.employee_id)
    ).size;
    const lateArrivalCount = lateArrivals.length;

    const genderStats = employees.reduce(
        (acc: { men: number; women: number; other: number }, emp: any) => {
            if (emp.gender === "MALE") acc.men += 1;
            else if (emp.gender === "FEMALE") acc.women += 1;
            else acc.other += 1;
            return acc;
        },
        { men: 0, women: 0, other: 0 }
    );

    // ================== Render ==================
    return (
        <div className="min-h-screen bg-[#EDEEFF]">
            <main className="mx-auto max-w-7xl px-4 pb-16 pt-6">
                {/* Greeting + toolbar */}
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">
                            <span className="text-indigo-600">Chào buổi sáng,</span> quản lý
                        </h1>
                        <p className="text-sm text-gray-500">Đây là thông tin nhân sự của ngày hôm nay</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-gray-400" />
                            <input
                                placeholder="Search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-64 rounded-full bg-white py-2 pl-9 pr-3 text-sm shadow-sm ring-1 ring-black/5 focus:outline-none"
                            />
                        </div>
                        <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-500"
                                style={{ background: "linear-gradient(to right, #B8C2FF 0%, #6183FF 100%)" }}
                        >
                            Quản lý nhân sự
                        </button>
                    </div>
                </div>

                {/* Overview */}
                <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                        <KPIStatCard icon={CircleUserRound} label="Điểm danh" value={attendance} delta={2.5} />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <KPIStatCard icon={Clock3} label="Đi muộn" value={lateArrivalCount} delta={1.5} deltaType="down" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <KPIStatCard icon={ThumbsDown} label="Thiếu chấm công" value={missingPunch.length} delta={2.5} />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <KPIStatCard icon={ThumbsUp} label="Xin nghỉ" value={leaveApply} delta={1.5} deltaType="down" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="xl:col-span-1"
                    >
                        <EmployeesDonut men={genderStats.men} women={genderStats.women} />
                    </motion.div>
                </section>

                {/* Leave Requests */}
                <section className="mt-6">
                    <LeaveRequestTable />
                </section>

                {/* Lists */}
                <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <EarlyRisersCard data={filteredEarlyRisers} />
                    <LateArrivalsCard data={filteredLateArrivals} />
                    <MissingPunchCard data={filteredMissingPunch} />
                </section>
            </main>

            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
    );
}
