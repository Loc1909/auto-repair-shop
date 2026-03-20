import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

function Parts() {
  const [parts, setParts] = useState([]);

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = () => {
    axiosClient.get("/admin/parts")
      .then(res => setParts(res.data))
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Xóa part này?")) return;

    axiosClient.delete(`/admin/parts/${id}`)
      .then(() => {
        alert("Xóa thành công");
        fetchParts();
      })
      .catch(() => alert("Xóa thất bại"));
  };

  return (
    <div>
      <h2>Parts</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Min Stock</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {parts.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.stockQuantity}</td>
              <td>{p.minStockLevel}</td>
              <td>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Parts;