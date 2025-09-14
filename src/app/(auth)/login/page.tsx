"use client";

import { useForm } from "react-hook-form";
import { getErrorMessage } from "@/app/utils/common";
import { getSession, signIn } from "next-auth/react";
import { useSnackbar } from "notistack";
import { useLoading } from "@/app/context/loadingContext";
import Link from "next/link";
import { toast } from "react-toastify";
import React from "react";

const Login = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { setLoading } = useLoading();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data: any) => {
        setLoading(true);
        const res = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password,
        });

        if (res?.error) {
            setLoading(false);
            enqueueSnackbar("Sai email hoặc mật khẩu", { variant: "error" });
        } else {
            const session = await getSession();
            const role = session?.user?.role;
            toast.success("Đăng nhập thành công!", { toastId: "login-success" });
            if (role === 0) {
                window.location.href = "/";
            } else {
                window.location.href = "/employee";
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {/* Bên trái: Form đăng nhập */}
                <div className="flex flex-col justify-center px-8 py-12">
                    {/* Logo */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-indigo-600">PeopleHub</h1>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900">
                        Đăng nhập vào hệ thống quản lý nhân sự
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Quản lý nhân viên, chấm công, theo dõi hiệu suất và nhiều hơn nữa — tất cả chỉ trong một nơi.
                    </p>

                    <form
                        className="mt-8 space-y-6"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                    >
                        <div className="space-y-4">
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email / Tên đăng nhập
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Nhập địa chỉ email"
                                    {...register("email", {
                                        required: "Ô nhập email là bắt buộc",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Vui lòng nhập đúng định dạng email",
                                        },
                                    })}
                                    className={`mt-1 block w-full px-3 py-2 border ${
                                        errors.email ? "border-red-500" : "border-gray-300"
                                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {getErrorMessage(errors.email)}
                                    </p>
                                )}
                            </div>

                            {/* Mật khẩu */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Mật khẩu
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="********"
                                    {...register("password", {
                                        required: "Ô nhập mật khẩu là bắt buộc",
                                        minLength: {
                                            value: 6,
                                            message: "Mật khẩu phải có ít nhất 6 ký tự",
                                        },
                                    })}
                                    className={`mt-1 block w-full px-3 py-2 border ${
                                        errors.password ? "border-red-500" : "border-gray-300"
                                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {getErrorMessage(errors.password)}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-y-2">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-indigo-600 hover:underline"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>



                        {/* Nút đăng nhập */}
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-white
                                     bg-gradient-to-r from-indigo-400 to-indigo-600
                                     hover:from-indigo-500 hover:to-indigo-700
                                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                                     transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
                            >
                                Đăng nhập
                            </button>

                        </div>
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-4">
                        Chưa có tài khoản?{" "}
                        <a href="/register" className="text-blue-600 hover:underline">
                            Đăng ký
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

export default Login;
