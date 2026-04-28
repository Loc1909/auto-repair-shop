import { useState } from "react";
import {
  Typography, Box, Grid, Card, CardContent,
  TextField, Button, Table, TableBody, TableCell,
  TableHead, TableRow, Chip, Autocomplete
} from "@mui/material";
import { createPartRequest } from "../../api/partRequestApi";
import dayjs from "dayjs";

export default function PartRequestTab({ repairOrderId, partRequests, parts, refreshData }) {
  const [selectedPart, setSelectedPart] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleRequestPart = async () => {
    if (!selectedPart || quantity <= 0) {
      alert("Vui lòng chọn vật tư và số lượng hợp lệ");
      return;
    }
    try {
      await createPartRequest({
        repairOrderId: Number(repairOrderId),
        partId: selectedPart.id,
        requestedQuantity: Number(quantity)
      });
      setSelectedPart(null);
      setQuantity(1);
      if (refreshData) refreshData();
    } catch (error) {
      console.error("Lỗi yêu cầu vật tư", error);
      alert(error.response?.data?.detail || "Yêu cầu vật tư thất bại!");
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={5}>
        <Card sx={{ borderRadius: 4, boxShadow: "0 8px 16px rgba(0,0,0,0.03)" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#e91e63", fontWeight: "bold" }}>
              Xuất kho / Yêu cầu Vật tư
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Autocomplete
                options={parts}
                getOptionLabel={(part) => `${part.name} (Kho: ${part.stockQuantity})`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={selectedPart}
                onChange={(_, newValue) => setSelectedPart(newValue)}
                renderInput={(params) => <TextField {...params} label="Tìm kiếm vật tư trong kho" />}
              />
              <TextField label="Số lượng xuất" type="number" inputProps={{ min: 1 }} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              <Button variant="contained" color="secondary" onClick={handleRequestPart} sx={{ py: 1.5, borderRadius: 2 }}>
                Gửi lệnh lấy hàng
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={7}>
        <Card sx={{ borderRadius: 4, boxShadow: "0 8px 16px rgba(0,0,0,0.03)" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Danh sách Yêu cầu đã duyệt/chờ xử lý
            </Typography>
            {partRequests.length === 0 ? (
              <Typography color="textSecondary">Biên lai trống.</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tên Vật Tư</TableCell>
                    <TableCell align="center">SL</TableCell>
                    <TableCell>Trạng Thái</TableCell>
                    <TableCell align="right">Ngày YC</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {partRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell sx={{ fontWeight: "bold" }}>{req.part?.name || `ID ${req.partId}`}</TableCell>
                      <TableCell align="center">{req.requestedQuantity}</TableCell>
                      <TableCell>
                        <Chip label={req.status} size="small" color={req.status === "APPROVED" ? "success" : req.status === "REJECTED" ? "error" : "warning"} />
                      </TableCell>
                      <TableCell align="right" sx={{ color: "#888", fontSize: "0.85rem" }}>
                        {dayjs(req.requestDate).format("DD/MM HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
