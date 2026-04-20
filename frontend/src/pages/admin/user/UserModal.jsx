import { useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TextField, MenuItem
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "../../../validations/userSchema";

const roles = ["ROLE_ADMIN", "ROLE_STAFF", "ROLE_CUSTOMER"];

function UserModal({ open, onClose, onSubmit, editingUser }) {

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(userSchema),
    context: { isEdit: !!editingUser },
    defaultValues: {
      username: "",
      password: "",
      email: "",
      role: "ROLE_STAFF",
      active: true
    }
  });

  useEffect(() => {
    if (editingUser) {
      reset({
        username: editingUser.username,
        email: editingUser.email,
        role: editingUser.role,
        active: editingUser.active,
        password: ""
      });
    } else {
      reset({
        username: "",
        password: "",
        email: "",
        role: "ROLE_STAFF",
        active: true
      });
    }
  }, [editingUser, reset]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {editingUser ? "Sửa người dùng" : "Thêm người dùng"}
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>

        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <TextField
              label="Tên người dùng"
              {...field}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          )}
        />

        {!editingUser && (
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                label="Mật khẩu"
                type="password"
                {...field}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
        )}

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              label="Email"
              {...field}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <TextField select label="Vai trò" {...field}>
              {roles.map(r => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="active"
          control={control}
          render={({ field }) => (
            <TextField
              select
              label="Kích hoạt"
              value={field.value ? "true" : "false"}
              onChange={(e) => field.onChange(e.target.value === "true")}
            >
              <MenuItem value="true">Có</MenuItem>
              <MenuItem value="false">Không</MenuItem>
            </TextField>
          )}
        />

      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserModal;