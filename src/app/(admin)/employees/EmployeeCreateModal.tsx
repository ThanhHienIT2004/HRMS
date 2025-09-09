"use client";

import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ================== GraphQL ==================
const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($data: CreateEmployeeInput!) {
    createEmployee(data: $data) {
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
    }
  }
`;

// ================== Type ==================
type EmployeeFormValues = {
    full_name: string;
    dob: string;
    gender: "male" | "female" | "other";
    place_of_birth: string;
    hometown: string;
    nationality: string;
    ethnicity: string;
    religion: string;
    marital_status: string;
    health_status: string;
    avatar_url: string;
};

// ================== Schema ==================
const schema = yup.object({
    full_name: yup.string().required("Họ tên bắt buộc"),
    dob: yup
        .string()
        .nullable()
        .matches(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh không hợp lệ"),
    gender: yup
        .mixed<"male" | "female" | "other">()
        .oneOf(["male", "female", "other"])
        .required("Giới tính bắt buộc"),
    place_of_birth: yup.string().nullable(),
    hometown: yup.string().nullable(),
    nationality: yup.string().nullable(),
    ethnicity: yup.string().nullable(),
    religion: yup.string().nullable(),
    marital_status: yup.string().nullable(),
    health_status: yup.string().nullable(),
    avatar_url: yup.string().url("URL ảnh không hợp lệ").nullable(),
});


export default function EmployeeCreateModal({
                                                onClose,
                                                onCreated,
                                            }: {
    onClose: () => void;
    onCreated?: (emp: any) => void;
}) {
    const [createEmployee, { loading }] = useMutation(CREATE_EMPLOYEE);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<EmployeeFormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            full_name: "",
            dob: "",
            gender: "other",
            place_of_birth: "",
            hometown: "",
            nationality: "",
            ethnicity: "",
            religion: "",
            marital_status: "",
            health_status: "",
            avatar_url: "",
        },
    });

    const onSubmit = async (values: EmployeeFormValues) => {
        try {
            const res = await createEmployee({ variables: { data: values } });
            if (onCreated) onCreated(res.data.createEmployee);
            reset();
            onClose();
        } catch (err) {
            console.error("Error creating employee:", err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Thêm nhân sự mới</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Full name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Họ tên</label>
                        <input
                            {...register("full_name")}
                            placeholder="Nhập họ tên"
                            className="w-full border rounded-md px-3 py-2"
                        />
                        {errors.full_name && (
                            <p className="text-red-500 text-xs">
                                {errors.full_name.message}
                            </p>
                        )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Ngày sinh</label>
                        <input
                            type="date"
                            {...register("dob")}
                            className="w-full border rounded-md px-3 py-2"
                        />
                        {errors.dob && (
                            <p className="text-red-500 text-xs">{errors.dob.message}</p>
                        )}
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Giới tính</label>
                        <select
                            {...register("gender")}
                            className="w-full border rounded-md px-3 py-2"
                        >
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                        {errors.gender && (
                            <p className="text-red-500 text-xs">{errors.gender.message}</p>
                        )}
                    </div>

                    {/* Other fields */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Nơi sinh</label>
                        <input
                            {...register("place_of_birth")}
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Quê quán</label>
                        <input
                            {...register("hometown")}
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Quốc tịch</label>
                        <input
                            {...register("nationality")}
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Dân tộc</label>
                        <input
                            {...register("ethnicity")}
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tôn giáo</label>
                        <input
                            {...register("religion")}
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Tình trạng hôn nhân
                        </label>
                        <input
                            {...register("marital_status")}
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Tình trạng sức khỏe
                        </label>
                        <input
                            {...register("health_status")}
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Ảnh đại diện (URL)
                        </label>
                        <input
                            {...register("avatar_url")}
                            className="w-full border rounded-md px-3 py-2"
                        />
                        {errors.avatar_url && (
                            <p className="text-red-500 text-xs">
                                {errors.avatar_url.message}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-md border hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500"
                        >
                            {loading ? "Đang lưu..." : "Lưu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
