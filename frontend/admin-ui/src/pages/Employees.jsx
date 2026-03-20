import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

function Employees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axiosClient.get("/admin/employees")
      .then(res => setEmployees(res.data))
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Xóa employee này?")) return;

    axiosClient.delete(`/admin/employees/${id}`)
      .then(() => {
        alert("Xóa thành công");
        fetchEmployees();
      })
      .catch(() => alert("Xóa thất bại"));
  };

  return (
    <div>
      <h2>Employees</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.name}</td>
              <td>{e.phone}</td>
              <td>
                <button onClick={() => handleDelete(e.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Employees;