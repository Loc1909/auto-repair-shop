import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

function Dashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    axiosClient.get("/admin/dashboard")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total Parts: {data.totalParts}</p>
      <p>Low Stock Parts: {data.lowStockParts}</p>
      <p>Total Services: {data.totalServices}</p>
      <p>Total Employees: {data.totalEmployees}</p>
      <p>Total Revenue: {data.totalRevenue}</p>
    </div>
  );
}

export default Dashboard;