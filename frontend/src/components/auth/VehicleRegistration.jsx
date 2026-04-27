import React from "react";

export default function VehicleRegistration({ vehicleForm, setVehicleForm, updateVehicleFrom }) {
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "2rem", marginBottom: ".5rem" }}>🚗</div>
        <h3 style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: ".3rem" }}>
          Thêm Xe Của Bạn
        </h3>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div className="input-wrap" style={{ marginBottom: 0 }}>
          <label>Biển số xe</label>
          <input placeholder="VD: 51F-123.45" value={vehicleForm.plate} onChange={updateVehicleFrom("plate")} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="input-wrap" style={{ marginBottom: 0 }}>
            <label>Hãng xe</label>
            <select value={vehicleForm.brand} onChange={updateVehicleFrom("brand")}>
              <option value="">Chọn hãng...</option>
              {["Toyota", "Honda", "Mazda", "Ford", "Hyundai", "Kia", "Mitsubishi", "Suzuki"].map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="input-wrap" style={{ marginBottom: 0 }}>
            <label>Năm sản xuất</label>
            <select value={vehicleForm.year} onChange={updateVehicleFrom("year")}>
              <option value="">Năm...</option>
              {Array.from({ length: 15 }, (_, i) => 2025 - i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="input-wrap" style={{ marginBottom: 0 }}>
          <label>Model</label>
          <input placeholder="VD: Fortuner 2.7V" value={vehicleForm.model} onChange={updateVehicleFrom("model")} />
        </div>
      </div>
    </div>
  );
}