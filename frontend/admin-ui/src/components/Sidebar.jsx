import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div style={{ width: "200px" }}>
      <h3>Admin</h3>
      <ul>
        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/admin/services">Services</Link></li>
        <li><Link to="/admin/parts">Parts</Link></li>
        <li><Link to="/admin/employees">Employees</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;