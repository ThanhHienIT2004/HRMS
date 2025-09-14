"use client";

import { useForm } from "react-hook-form";
import { getErrorMessage } from "@/app/utils/common";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useLoading } from "@/app/context/loadingContext";
import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import REGISTER_MUTATION from "@/libs/graphqls/mutations/registerMutations";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { UserPlus } from "lucide-react";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { setLoading } = useLoading();
    const [step, setStep] = useState(1);

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
            phone: "",
            role: "",
            employee_id: "",
        },
    });

    const [registerUser] = useMutation(REGISTER_MUTATION);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const { email, password, phone, role, employee_id } = data;

            const userData = {
                email,
                password,
                phone,
                role: Number(role),
                employee_id: employee_id || `NV${Date.now()}`,
            };

            await registerUser({ variables: { userData } });
            enqueueSnackbar("Đăng ký thành công!", { variant: "success" });
            router.push("/login");
        } catch (error) {
            enqueueSnackbar(getErrorMessage(error), { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async () => {
        const result = await trigger(["email", "password"]);
        if (result) setStep(2);
    };

    const handleBack = () => setStep(1);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow overflow-hidden grid grid-cols-1 md:grid-cols-2">
                <div className="flex flex-col justify-center px-8 py-12">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-600 mb-4">PeopleHub</h1>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Hãy đăng ký tài khoản của bạn
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Nếu bạn đã có tài khoản, vui lòng đăng nhập. Nếu không, hãy tạo tài khoản mới ngay!
                        </p>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {step === 1 && (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        {...register("email", {
                                            required: "Ô nhập email là bắt buộc",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Vui lòng nhập đúng định dạng email",
                                            },
                                        })}
                                        className={`mt-1 block w-full px-3 py-2 border ${
                                            errors.email ? "border-red-500" : "border-gray-300"
                                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                        placeholder="Nhập địa chỉ email"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {getErrorMessage(errors.email)}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Mật khẩu
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            {...register("password", {
                                                required: "Mật khẩu là bắt buộc",
                                                minLength: { value: 6, message: "Ít nhất 6 ký tự" },
                                            })}
                                            className={`mt-1 block w-full px-3 py-2 border ${
                                                errors.password ? "border-red-500" : "border-gray-300"
                                            } rounded-md shadow-sm pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                            placeholder="Nhập mật khẩu"
                                        />
                                        <div
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute top-2.5 right-3 cursor-pointer text-gray-500"
                                        >
                                            {showPassword ? (
                                                <EyeSlashIcon className="h-5 w-5" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5" />
                                            )}
                                        </div>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {getErrorMessage(errors.password)}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500"
                                    style={{ background: "linear-gradient(to right, #B8C2FF 0%, #6183FF 100%)" }}
                                >
                                    Tiếp theo
                                </button>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Số điện thoại
                                    </label>
                                    <input
                                        id="phone"
                                        {...register("phone", {
                                            pattern: {
                                                value: /^[0-9]{9,11}$/,
                                                message: "Số điện thoại không hợp lệ",
                                            },
                                        })}
                                        className={`mt-1 block w-full px-3 py-2 border ${
                                            errors.phone ? "border-red-500" : "border-gray-300"
                                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                        placeholder="Nhập số điện thoại"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {getErrorMessage(errors.phone)}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700">
                                        Mã nhân viên
                                    </label>
                                    <input
                                        id="employee_id"
                                        {...register("employee_id")}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Nhập mã nhân viên"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                        Vai trò
                                    </label>
                                    <select
                                        id="role"
                                        {...register("role", { required: "Vai trò là bắt buộc" })}
                                        className={`mt-1 block w-full px-3 py-2 border ${
                                            errors.role ? "border-red-500" : "border-gray-300"
                                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    >
                                        <option value="0">Nhân sự</option>
                                        <option value="1">Quản trị</option>
                                    </select>
                                    {errors.role && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {getErrorMessage(errors.role)}
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-400"
                                        style={{ background: "linear-gradient(to right, #B8C2FF 0%, #6183FF 100%)" }}

                                    >
                                        Quay lại
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
                                        style={{ background: "linear-gradient(to right, #B8C2FF 0%, #6183FF 100%)" }}

                                    >
                                        Đăng ký
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-4">
                        Đã có tài khoản?{" "}
                        <a href="/login" className="text-blue-600 hover:underline">
                            Đăng nhập
                        </a>
                    </p>
                </div>

                {/* Bên phải: Ảnh minh họa */}
                <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-#B8C2FF 0% to-blue-600 p-8">
                    <img
                        src="/login_anh.png"
                        alt="Hình minh họa hệ thống HR"
                        className="max-h-[400px] rounded-xl shadow-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default Register;