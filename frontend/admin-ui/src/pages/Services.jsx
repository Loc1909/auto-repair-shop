import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    axiosClient.get("/admin/services")
      .then(res => setServices(res.data))
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Xóa service này?")) return;

    axiosClient.delete(`/admin/services/${id}`)
      .then(() => {
        alert("Xóa thành công");
        fetchServices();
      })
      .catch(() => alert("Xóa thất bại"));
  };

  return (
    <div>
      <h2>Services</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {services.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.price}</td>
              <td>{s.categoryName}</td>
              <td>
                <button onClick={() => handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Services;