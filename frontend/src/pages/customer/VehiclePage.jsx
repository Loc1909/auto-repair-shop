import { useEffect, useState } from "react";
import { getCurrentUserVehicle, createVehicle } from "../../api/vehicleApi";
import VehicleRegistration from "../../components/auth/VehicleRegistration";
import { getCustomerByUserId } from "../../api/customerApi";
import BackgroundOrbs from "../../components/effects/BackgroundOrbs";
import { useOutletContext } from "react-router-dom";
import "../../styles/vehiclePage.css"
import BrandBadge from "../../components/customer/VehicleBrandBadge";

export default function VehiclePage() {
    const { setUser, showToast } = useOutletContext();
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRegistration, setShowRegistration] = useState(false);
    const [vehicleForm, setVehicleForm] = useState({
        plate: "",
        brand: "",
        model: "",
        year: "",
    });
    const fields = [
        { key: "brand", label: "Hãng xe", placeholder: "Toyota, Honda…" },
        { key: "model", label: "Dòng xe", placeholder: "Camry, Civic…" },
        { key: "licensePlate", label: "Biển số", placeholder: "51G-000.00" },
        { key: "year", label: "Năm sản xuất", placeholder: "2024", type: "number" },
    ];
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await getCurrentUserVehicle();
                setVehicles(response.data);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    const handleAddVehicle = async () => {
        try {
            const customerRes = await getCustomerByUserId(userId);
            const response = await createVehicle({
                licensePlate: vehicleForm.plate,
                brand: vehicleForm.brand,
                model: vehicleForm.model,
                year: vehicleForm.year,
                customerId: customerRes.data.id
            });
            setVehicles((prev) => [...prev, response.data]);
            setShowRegistration(false);
            setVehicleForm({ plate: "", brand: "", model: "", year: "" });
        } catch (error) {
            console.error("Error adding vehicle:", error);
        }
    };

    const updateVehicleFrom = (key) => (e) => {
        setVehicleForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

    if (loading) {
        return <>
            <div className="orb orb-1" />
            <BackgroundOrbs />
            <div className="orb orb-2" />
            <div>Loading...</div>
        </>;
    }
    return (
        <>
            <div className="orb orb-1" />
            <BackgroundOrbs />
            <div className="orb orb-2" />

            <div style={{ minHeight: "100vh", padding: "6rem 5% 3rem", position: "relative" }}>
                <div className="container">

                    {/* Header */}
                    <header className="page-header">
                        <h1 className="page-title">Xe Của Bạn</h1>
                        <p className="page-sub">Quản lý phương tiện đã đăng ký</p>
                    </header>

                    {/* Stat bar */}
                    <div className="stat-bar">
                        <div className="stat-pill">
                            <span className="stat-icon">🚗</span>
                            <div>
                                <div className="stat-value">{vehicles.length}</div>
                                <div className="stat-label">Xe đã đăng ký</div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle list */}
                    {vehicles.length === 0 ? (
                        <div className="empty">
                            <div className="empty-icon">🚘</div>
                            <p>Bạn chưa có xe nào được đăng ký.</p>
                        </div>
                    ) : (
                        <div className="card-list">
                            {vehicles.map((v) => (
                                <div className="vehicle-card" key={v.id}>
                                    <BrandBadge brand={v.brand} />
                                    <div className="card-info">
                                        <div className="card-name">{v.brand} {v.model}</div>
                                        <div className="card-meta">
                                            <span className="meta-tag plate">{v.licensePlate}</span>
                                            <span className="meta-tag">{v.year}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="divider" />

                    <div className="action-row">
                        <button
                            className={`btn ${showRegistration ? "btn-secondary" : "btn-primary"}`}
                            onClick={() => setShowRegistration((p) => !p)} >
                            {showRegistration ? "✕ Đóng" : "+ Thêm Xe"}
                        </button>
                    </div>

                    {showRegistration && (
                        <div className="reg-panel">
                            <div className="reg-title">Đăng ký xe mới</div>
                            <VehicleRegistration vehicleForm={vehicleForm}
                                setVehicleForm={setVehicleForm} updateVehicleFrom={updateVehicleFrom} />
                            <div className="reg-footer">
                                <button className="btn btn-save" onClick={handleAddVehicle}>
                                    ✓ Lưu Xe
                                </button>
                                <button className="btn btn-secondary"
                                    onClick={() => {
                                        setVehicleForm({ plate: "", brand: "", model: "", year: "" });
                                        setShowRegistration(false);
                                    }}>
                                    Hủy
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}