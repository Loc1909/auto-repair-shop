import { useState, useEffect } from "react";
import {
  Typography, Box, Paper, Grid, CircularProgress,
  Button, List, ListItem, ListItemText, Divider,
  TextField, MenuItem, Select, FormControl, InputLabel, Chip,
  Autocomplete, IconButton, Table, TableBody, TableCell,
  TableHead, TableRow, Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import dayjs from "dayjs";

function EmployeeRepairProgress() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [progresses, setProgresses] = useState([]);
  const [partRequests, setPartRequests] = useState([]);
  const [parts, setParts] = useState([]);
  const [services, setServices] = useState([]);
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form Cập nhật tiến độ
  const [newStatus, setNewStatus] = useState("DIAGNOSING");
  const [progressNote, setProgressNote] = useState("");

  // Form Yêu cầu vật tư
  const [selectedPart, setSelectedPart] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Form Lập báo giá
  const [quotationItems, setQuotationItems] = useState([]);
  const [quotationItemType, setQuotationItemType] = useState("PART");
  const [quotationSelectedItem, setQuotationSelectedItem] = useState(null);
  const [quotationQty, setQuotationQty] = useState(1);

  const REPAIR_STATUSES = [
    { value: "DIAGNOSING", label: "Đang chẩn đoán" },
    { value: "QUOTING", label: "Đang báo giá" },
    { value: "APPROVED", label: "Đã duyệt báo giá" },
    { value: "REPAIRING", label: "Đang sửa chữa" },
    { value: "COMPLETED", label: "Hoàn thành" }
  ];

  useEffect(() => {
    fetchData();
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

      // Fetch quotation (có thể chưa có → bắt lỗi riêng)
      try {
        const quotRes = await axiosClient.get(`/quotations/by-order/${id}`);
        setQuotation(quotRes.data);
      } catch {
        setQuotation(null);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu chi tiết phiếu sửa chữa", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async () => {
    try {
      await axiosClient.post("/repair-progress", {
        repairOrderId: Number(id),
        status: newStatus,
        note: progressNote
      });
      setProgressNote("");
      fetchData();
    } catch (error) {
      console.error("Lỗi cập nhật tiến độ", error);
      alert("Cập nhật tiến độ thất bại!");
    }
  };

  const handleRequestPart = async () => {
    if (!selectedPart || quantity <= 0) {
      alert("Vui lòng chọn vật tư và số lượng hợp lệ");
      return;
    }
    try {
      await axiosClient.post("/part-requests", {
        repairOrderId: Number(id),
        partId: selectedPart.id,
        requestedQuantity: Number(quantity)
      });
      setSelectedPart(null);
      setQuantity(1);
      fetchData();
    } catch (error) {
      console.error("Lỗi yêu cầu vật tư", error);
      alert("Yêu cầu vật tư thất bại!");
    }
  };

  // ── Báo giá ──────────────────────────────────────────────
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
        quantity: Number(quotationQty)
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
        repairOrderId: Number(id),
        items: quotationItems.map(({ itemType, itemId, quantity }) => ({
          itemType,
          itemId,
          quantity
        }))
      });
      setQuotationItems([]);
      fetchData();
    } catch (error) {
      console.error("Lỗi tạo báo giá", error);
      alert("Tạo báo giá thất bại!");
    }
  };
  // ─────────────────────────────────────────────────────────

  const autocompleteOptions =
    quotationItemType === "PART" ? parts : services;

  if (loading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Chi tiết Phiếu sửa chữa #{id}
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/employee/repair-orders")}>
          Quay lại
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* CỘT TRÁI: Tiến độ + Vật tư */}
        <Grid item xs={12} md={6}>
          {/* Cập nhật tiến độ */}
          <Paper sx={{ p: 2, borderRadius: 2, mb: 3, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#1976d2", fontWeight: "bold" }}>
              Cập nhật Tiến độ
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái mới</InputLabel>
                <Select
                  value={newStatus}
                  label="Trạng thái mới"
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {REPAIR_STATUSES.map(s => (
                    <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Ghi chú hoàn thành/tiến độ"
                multiline
                rows={2}
                size="small"
                value={progressNote}
                onChange={(e) => setProgressNote(e.target.value)}
              />

              <Button variant="contained" color="primary" onClick={handleUpdateProgress}>
                Ghi nhận Tiến độ
              </Button>
            </Box>
          </Paper>

          {/* Lịch sử tiến độ */}
          <Paper sx={{ p: 2, borderRadius: 2, mb: 3, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Lịch sử Tiến độ
            </Typography>
            {progresses.length === 0 ? (
              <Typography color="textSecondary">Chưa có ghi nhận tiến độ.</Typography>
            ) : (
              <List>
                {progresses.map((p, index) => (
                  <div key={p.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle2" fontWeight="bold">{p.status}</Typography>
                            <span style={{ fontSize: "0.8rem", color: "#888" }}>
                              {dayjs(p.timestamp).format("DD/MM/YYYY HH:mm")}
                            </span>
                          </Box>
                        }
                        secondary={p.note || "Không có ghi chú"}
                      />
                    </ListItem>
                    {index < progresses.length - 1 && <Divider component="li" />}
                  </div>
                ))}
              </List>
            )}
          </Paper>

          {/* Yêu cầu vật tư */}
          <Paper sx={{ p: 2, borderRadius: 2, mb: 3, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#e91e63", fontWeight: "bold" }}>
              Yêu cầu Vật tư mới
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Autocomplete
                options={parts}
                getOptionLabel={(part) =>
                  `${part.name} (Kho: ${part.stockQuantity} - ${part.price?.toLocaleString() || "N/A"} VND)`
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={selectedPart}
                onChange={(_, newValue) => setSelectedPart(newValue)}
                noOptionsText="Không tìm thấy vật tư"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn Vật tư"
                    size="small"
                    placeholder="Gõ tên vật tư để tìm..."
                  />
                )}
              />
              <TextField
                label="Số lượng cần"
                type="number"
                size="small"
                inputProps={{ min: 1 }}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <Button variant="contained" color="secondary" onClick={handleRequestPart}>
                Gửi Yêu cầu
              </Button>
            </Box>
          </Paper>

          {/* Danh sách vật tư đã yêu cầu */}
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Danh sách Vật tư đã yêu cầu
            </Typography>
            {partRequests.length === 0 ? (
              <Typography color="textSecondary">Chưa có yêu cầu vật tư nào.</Typography>
            ) : (
              <List>
                {partRequests.map((req, index) => (
                  <div key={req.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between">
                            <strong>{req.part?.name || `Vật tư ID: ${req.partId}`}</strong>
                            <Chip
                              label={req.status}
                              size="small"
                              color={req.status === "APPROVED" ? "success" : req.status === "REJECTED" ? "error" : "warning"}
                            />
                          </Box>
                        }
                        secondary={`Số lượng: ${req.requestedQuantity} - Ngày YC: ${dayjs(req.requestDate).format("DD/MM/YYYY HH:mm")}`}
                      />
                    </ListItem>
                    {index < partRequests.length - 1 && <Divider component="li" />}
                  </div>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* CỘT PHẢI: Báo giá */}
        <Grid item xs={12} md={6}>
          {/* Hiển thị báo giá hiện tại */}
          <Paper sx={{ p: 2, borderRadius: 2, mb: 3, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#388e3c", fontWeight: "bold" }}>
              Báo giá hiện tại
            </Typography>
            {quotation ? (
              <>
                <Box display="flex" gap={1} alignItems="center" mb={2}>
                  <Chip
                    label={quotation.status}
                    color={quotation.status === "APPROVED" ? "success" : quotation.status === "REJECTED" ? "error" : "warning"}
                  />
                  <Typography variant="body2" color="textSecondary">
                    Tạo lúc: {dayjs(quotation.createdAt).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                </Box>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Tên</strong></TableCell>
                      <TableCell><strong>Loại</strong></TableCell>
                      <TableCell align="right"><strong>SL</strong></TableCell>
                      <TableCell align="right"><strong>Đơn giá</strong></TableCell>
                      <TableCell align="right"><strong>Thành tiền</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {quotation.details.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell>{d.itemName}</TableCell>
                        <TableCell>{d.itemType}</TableCell>
                        <TableCell align="right">{d.quantity}</TableCell>
                        <TableCell align="right">{d.unitPrice?.toLocaleString()} VND</TableCell>
                        <TableCell align="right">{d.subtotal?.toLocaleString()} VND</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Box mt={2} textAlign="right">
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    Tổng cộng: {quotation.totalPrice?.toLocaleString()} VND
                  </Typography>
                </Box>
              </>
            ) : (
              <Alert severity="info">Phiếu này chưa có báo giá nào.</Alert>
            )}
          </Paper>

          {/* Tạo báo giá mới */}
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#f57c00", fontWeight: "bold" }}>
              {quotation ? "Tạo báo giá mới (ghi đè)" : "Tạo báo giá"}
            </Typography>

            {/* Thêm mục vào báo giá */}
            <Box display="flex" flexDirection="column" gap={2} mb={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Loại mục</InputLabel>
                <Select
                  value={quotationItemType}
                  label="Loại mục"
                  onChange={(e) => {
                    setQuotationItemType(e.target.value);
                    setQuotationSelectedItem(null);
                  }}
                >
                  <MenuItem value="PART">Vật tư (PART)</MenuItem>
                  <MenuItem value="SERVICE">Dịch vụ (SERVICE)</MenuItem>
                </Select>
              </FormControl>

              <Autocomplete
                options={autocompleteOptions}
                getOptionLabel={(item) => item.name || ""}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={quotationSelectedItem}
                onChange={(_, newValue) => setQuotationSelectedItem(newValue)}
                noOptionsText="Không tìm thấy"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={quotationItemType === "PART" ? "Chọn Vật tư" : "Chọn Dịch vụ"}
                    size="small"
                    placeholder="Gõ để tìm kiếm..."
                  />
                )}
              />

              <TextField
                label="Số lượng"
                type="number"
                size="small"
                inputProps={{ min: 1 }}
                value={quotationQty}
                onChange={(e) => setQuotationQty(e.target.value)}
              />

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddQuotationItem}
              >
                Thêm vào báo giá
              </Button>
            </Box>

            {/* Danh sách mục đã thêm */}
            {quotationItems.length > 0 && (
              <>
                <Divider sx={{ mb: 2 }} />
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Tên</strong></TableCell>
                      <TableCell><strong>Loại</strong></TableCell>
                      <TableCell align="right"><strong>SL</strong></TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {quotationItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.itemType}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveQuotationItem(index)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="warning"
                    fullWidth
                    onClick={handleCreateQuotation}
                  >
                    Gửi Báo giá ({quotationItems.length} mục)
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EmployeeRepairProgress;

