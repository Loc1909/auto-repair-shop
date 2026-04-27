import React, { useState } from "react";

export default function VehicleRegistration({ vehicleForm, setVehicleForm, updateVehicleFrom }) {
  const [customBrand, setCustomBrand] = useState("");
  const [customYear, setCustomYear] = useState(vehicleForm.year || "");

  const handleBrandChange = (e) => {
    const value = e.target.value;
    setVehicleForm((prev) => ({ ...prev, brand: value }));
    setCustomBrand(value);
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    setVehicleForm((prev) => ({ ...prev, year: value }));
    setCustomYear(value);
  };

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
            <input
              placeholder="Nhập hãng xe..."
              value={customBrand}
              onChange={handleBrandChange}
              list="brand-options"
            />
            <datalist id="brand-options">
              {["Toyota", "Honda", "Mazda", "Ford", "Hyundai", "Kia", "Mitsubishi", "Suzuki"].map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </div>
          <div className="input-wrap" style={{ marginBottom: 0 }}>
            <label>Năm sản xuất</label>

            <input placeholder="Nhập năm..." value={customYear}
              onChange={handleYearChange} list="year-options" />
            <datalist id="year-options">
              {Array.from({ length: 4 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </datalist>
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