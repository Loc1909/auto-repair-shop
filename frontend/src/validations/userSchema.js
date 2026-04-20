import * as yup from "yup";

export const userSchema = yup.object({
  username: yup
    .string()
    .required("Username không được để trống")
    .matches(/^[a-z0-9]+$/, "Chỉ chứa chữ thường và số"),

  password: yup
    .string()
    .min(6, "Ít nhất 6 ký tự")
    .when("$isEdit", {
      is: false,
      then: (schema) => schema.required("Password không được để trống")
    }),

  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),

  role: yup.string().required("Chọn role"),

  active: yup.boolean()
});