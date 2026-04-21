import { useState } from "react";
import {
  Typography, Box, Grid, Card, CardContent,
  FormControl, InputLabel, Select, MenuItem, TextField, Button,
  Table, TableBody, TableCell, TableHead, TableRow, Chip, Alert, IconButton, Autocomplete
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import axiosClient from "../../api/axiosClient";
import dayjs from "dayjs";

export default function RepairQuotationTab({ repairOrderId, quotation, parts, services, refreshData }) {
  const [quotationItems, setQuotationItems] = useState([]);
  const [quotationItemType, setQuotationItemType] = useState("PART");
  const [quotationSelectedItem, setQuotationSelectedItem] = useState(null);
  const [quotationQty, setQuotationQty] = useState(1);

  const autocompleteOptions = quotationItemType === "PART" ? parts : services;

  const handleAddQuotationItem = () => {
    if (!quotationSelectedItem || quotationQty <= 0) {
      alert("Vui lòng chọn mục và nhập số lượng hợp lệ");
      return;
    }
    setQuotationItems((prev) => [
      ...prev,
      {
        itemType: quotationItemType,
        itemId: quotationSelectedItem.id,
        itemName: quotationSelectedItem.name,
        quantity: Number(quotationQty),
        unitPrice: quotationSelectedItem.price || 0
      }
    ]);
    setQuotationSelectedItem(null);
    setQuotationQty(1);
  };

  const handleRemoveQuotationItem = (index) => {
    setQuotationItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateQuotation = async () => {
    if (quotationItems.length === 0) {
      alert("Vui lòng thêm ít nhất một mục vào báo giá");
      return;
    }
    try {
      await axiosClient.post("/quotations", {
        repairOrderId: Number(repairOrderId),
        items: quotationItems.map(({ itemType, itemId, quantity }) => ({
          itemType,
          itemId,
          quantity
        }))
      });
      setQuotationItems([]);
      if (refreshData) refreshData();
    } catch (error) {
      console.error("Lỗi tạo báo giá", error);
      alert(error.response?.data?.detail || "Tạo báo giá thất bại!");
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} lg={7}>
        <Card sx={{ borderRadius: 4, boxShadow: "0 8px 16px rgba(0,0,0,0.03)", height: "100%" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold", color: "#388e3c" }}>
              Bản Báo Giá Đã Lưu
            </Typography>
            {quotation ? (
              <Box>
                <Box display="flex" gap={2} alignItems="center" mb={3}>
                  <Chip label={quotation.status} color={quotation.status === "APPROVED" ? "success" : quotation.status === "REJECTED" ? "error" : "warning"} sx={{ fontWeight: "bold" }} />
                  <Typography variant="body2" color="textSecondary">
                    Lập ngày: {dayjs(quotation.createdAt).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                </Box>
                <Table size="small" sx={{ "& th": { fontWeight: "bold" } }}>
                  <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell>Tên Hạng Mục</TableCell>
                      <TableCell>Phân loại</TableCell>
                      <TableCell align="right">SL</TableCell>
                      <TableCell align="right">Đơn giá</TableCell>
                      <TableCell align="right">Thành tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {quotation.details.map((d) => (
                      <TableRow key={d.id} hover>
                        <TableCell>{d.itemName}</TableCell>
                        <TableCell>{d.itemType === "PART" ? "Vật tư" : "Dịch vụ"}</TableCell>
                        <TableCell align="right">{d.quantity}</TableCell>
                        <TableCell align="right">{d.unitPrice?.toLocaleString()} đ</TableCell>
                        <TableCell align="right"><strong>{d.subtotal?.toLocaleString()} đ</strong></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Box mt={3} textAlign="right" sx={{ p: 2, bgcolor: "rgba(76, 175, 80, 0.05)", borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight="bold" color="success.main">
                    Tổng cộng: {quotation.totalPrice?.toLocaleString()} đ
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Alert severity="info" sx={{ borderRadius: 2 }}>Phiếu này hiện chưa lưu báo giá nào.</Alert>
            )}
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} lg={5}>
        <Card sx={{ borderRadius: 4, boxShadow: "0 8px 16px rgba(0,0,0,0.03)", height: "100%" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#f57c00", fontWeight: "bold" }}>
              {quotation ? "Tạo báo giá mới (Ghi đè)" : "Khởi tạo Bảng Báo Giá"}
            </Typography>
            
            <Box display="flex" flexDirection="column" gap={2} mb={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Loại mục thêm</InputLabel>
                <Select value={quotationItemType} label="Loại mục thêm" onChange={(e) => { setQuotationItemType(e.target.value); setQuotationSelectedItem(null); } }>
                  <MenuItem value="PART">Vật tư</MenuItem>
                  <MenuItem value="SERVICE">Dịch vụ</MenuItem>
                </Select>
              </FormControl>
              
              <Autocomplete
                options={autocompleteOptions}
                getOptionLabel={(item) => `${item.name} - ${item.price?.toLocaleString()}đ`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={quotationSelectedItem}
                onChange={(_, newValue) => setQuotationSelectedItem(newValue)}
                renderInput={(params) => (<TextField {...params} label="Tìm Hạng mục" size="small" />)}
              />
              
              <TextField label="Số lượng" type="number" size="small" inputProps={{ min: 1 }} value={quotationQty} onChange={(e) => setQuotationQty(e.target.value)} />
              
              <Button variant="outlined" startIcon={<Add />} onClick={handleAddQuotationItem} sx={{ borderRadius: 2 }}>
                Thêm dòng
              </Button>
            </Box>
            
            {quotationItems.length > 0 && (
              <Box sx={{ mt: 3, pt: 2, borderTop: "1px dashed #ccc" }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>Dự kiến lưu:</Typography>
                {quotationItems.map((item, index) => (
                  <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ bgcolor: "#fafafa", p: 1, borderRadius: 1, mb: 1 }}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">{item.itemName}</Typography>
                      <Typography variant="caption" color="textSecondary">{item.itemType} x {item.quantity}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" fontWeight="bold">{(item.unitPrice * item.quantity).toLocaleString()}đ</Typography>
                      <IconButton size="small" color="error" onClick={() => handleRemoveQuotationItem(index)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
                <Button variant="contained" color="warning" fullWidth onClick={handleCreateQuotation} sx={{ mt: 2, borderRadius: 2, py: 1.5 }}>
                  Lưu và Gửi báo giá
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
