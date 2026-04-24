import { useState, useEffect } from "react";
import {
  Typography, Box, CircularProgress,
  Button, Tabs, Tab
} from "@mui/material";
import { Update, FormatQuote, PrecisionManufacturing } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

import RepairStatusTab from "../../components/employee/RepairStatusTab";
import RepairQuotationTab from "../../components/employee/RepairQuotationTab";
import PartRequestTab from "../../components/employee/PartRequestTab";

import { socket, connectSocket, disconnectSocket } from "../../api/socket";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function EmployeeRepairProgress() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState(0);
  
  // Dữ liệu API dùng chung
  const [progresses, setProgresses] = useState([]);
  const [partRequests, setPartRequests] = useState([]);
  const [parts, setParts] = useState([]);
  const [services, setServices] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    
    connectSocket();
    socket.on("repair_progress_updated", (newProgress) => {
      if (String(newProgress.repairOrderId) === String(id)) {
        setProgresses(prev => {
          if (prev.find(p => p.id === newProgress.id)) return prev;
          // Thêm vào đầu danh sách (giả sử danh sách hiển thị từ mới đến cũ)
          // Hoặc thêm vào cuối tùy logic UI. Trong RepairStatusTab là map từ mảng.
          return [newProgress, ...prev];
        });
      }
    });

    return () => {
      socket.off("repair_progress_updated");
      disconnectSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [progRes, reqRes, partsRes, servicesRes] = await Promise.all([
        axiosClient.get(`/repair-progress/by-order/${id}`),
        axiosClient.get(`/part-requests/by-order/${id}`),
        axiosClient.get(`/employee/parts`),
        axiosClient.get(`/employee/services`)
      ]);
      setProgresses(progRes.data);
      setPartRequests(reqRes.data);
      setParts(partsRes.data || []);
      setServices(servicesRes.data || []);

      try {
        const quotRes = await axiosClient.get(`/quotations/by-order/${id}`);
        setQuotations(quotRes.data || []);
      } catch {
        setQuotations([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu chi tiết phiếu sửa chữa", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#1e1e2d" }}>
            Chi tiết Phiếu sửa chữa #{id}
          </Typography>
          <Typography variant="body2" sx={{ color: "#6e6e7c", mt: 0.5 }}>
            Quản lý tiến độ sửa chữa, dự toán báo giá và danh sách vật tư.
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => navigate("/employee/repair-orders")} sx={{ borderRadius: 2 }}>
          Quay lại danh sách
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} aria-label="repair tabs">
          <Tab icon={<Update />} iconPosition="start" label="Tiến độ thực hiện" sx={{ fontWeight: 'bold' }} />
          <Tab icon={<FormatQuote />} iconPosition="start" label="Lập Báo Giá" sx={{ fontWeight: 'bold' }} />
          <Tab icon={<PrecisionManufacturing />} iconPosition="start" label="Yêu cầu Vật tư" sx={{ fontWeight: 'bold' }} />
        </Tabs>
      </Box>

      {/* TABS 1: TIẾN ĐỘ THỰC HIỆN */}
      <TabPanel value={tabValue} index={0}>
        <RepairStatusTab 
          repairOrderId={id} 
          progresses={progresses} 
          refreshData={fetchData} 
        />
      </TabPanel>

      {/* TABS 2: BÁO GIÁ */}
      <TabPanel value={tabValue} index={1}>
        <RepairQuotationTab
          repairOrderId={id}
          quotations={quotations}
          parts={parts}
          services={services}
          refreshData={fetchData}
        />
      </TabPanel>

      {/* TABS 3: YÊU CẦU VẬT TƯ */}
      <TabPanel value={tabValue} index={2}>
        <PartRequestTab
          repairOrderId={id}
          partRequests={partRequests}
          parts={parts}
          refreshData={fetchData}
        />
      </TabPanel>
    </Box>
  );
}

export default EmployeeRepairProgress;

