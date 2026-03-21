import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper,
  Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField
} from "@mui/material";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    position: "",
    salary: ""
  });

  // ================= FETCH =================
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axiosClient.get("/admin/employees")
      .then(res => setEmployees(res.data))
      .catch(err => console.error(err));
  };

  // ================= DELETE =================
  const handleDelete = (id) => {
  console.log("CLICK DELETE:", id);

  // bỏ confirm để test
  axiosClient.delete(`/admin/employees/${id}`)
    .then(() => {
      alert("Xóa thành công");
      fetchEmployees();
    })
    .catch(err => {
      console.log(err);
      alert("Xóa thất bại");
    });
};

  // ================= EDIT =================
  const handleOpenModal = (emp) => {
    setEditingEmployee(emp);
    setForm({
      name: emp.name || "",
      phone: emp.phone || "",
      position: emp.position || "",
      salary: emp.salary || ""
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // ================= UPDATE =================
  const handleSubmit = () => {
    if (!form.name || !form.phone) {
      alert("Vui lòng nhập Name và Phone");
      return;
    }

    axiosClient.put(`/admin/employees/${editingEmployee.id}`, form)
      .then(() => {
        alert("Cập nhật thành công");
        fetchEmployees();
        setOpenModal(false);
      })
      .catch(err => {
        console.log(err);
        alert("Cập nhật thất bại");
      });
  };

  // ================= UI =================
  return (
    <div style={{ padding: "20px" }}>
      <h2>Employees</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {employees.map(e => (
              <TableRow key={e.id}>
                <TableCell>{e.id}</TableCell>
                <TableCell>{e.username}</TableCell>
                <TableCell>{e.name}</TableCell>
                <TableCell>{e.phone}</TableCell>
                <TableCell>{e.position}</TableCell>
                <TableCell>{e.salary}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => handleOpenModal(e)}
                    style={{ marginRight: 5 }}
                  >
                    Sửa
                  </Button>

                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(e.id)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      {/* ================= MODAL ================= */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Sửa Employee</DialogTitle>

        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginTop: 5
          }}
        >
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <TextField
            label="Position"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          />

          <TextField
            label="Salary"
            type="number"
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Employees;