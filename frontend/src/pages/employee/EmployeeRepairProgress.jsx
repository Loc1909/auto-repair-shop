import { useState, useEffect } from "react";
import {
  Typography, Box, CircularProgress,
  Button, Tabs, Tab
} from "@mui/material";
import { Update, FormatQuote, PrecisionManufacturing } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";

import RepairStatusTab from "../../components/employee/RepairStatusTab";
import RepairQuotationTab from "../../components/employee/RepairQuotationTab";
import PartRequestTab from "../../components/employee/PartRequestTab";
import { useEmployeeRepairProgress } from "../../hooks/useEmployeeRepairProgress";

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

  const {
    progresses,
    partRequests,
    parts,
    services,
    quotations,
    loading,
    fetchData
  } = useEmployeeRepairProgress(id);

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

