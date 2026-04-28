import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
} from "@mui/material";
import { getAllPartRequests, approvePartRequest, rejectPartRequest } from "../../../api/partRequestApi";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import dayjs from "dayjs";

const statusConfig = {
    PENDING: { label: "Chờ xử lý", color: "warning", bg: "#fff3e0" },
    APPROVED: { label: "Đã duyệt", color: "success", bg: "#e8f5e9" },
    REJECTED: { label: "Từ chối", color: "error", bg: "#ffebee" },
};

function PartRequests() {
    const [requests, setRequests] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("PENDING");
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchRequests();
    }, [statusFilter, search]);

    useEffect(() => {
        const delay = setTimeout(() => {
            setSearch(searchInput);
        }, 500);
        return () => clearTimeout(delay);
    }, [searchInput]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await getAllPartRequests(statusFilter);
            let data = Array.isArray(response.data) ? response.data : response.data?.content || [];


            // ✅ FIX: search theo DTO đúng
            if (search) {
                data = data.filter(req =>
                    req.partName?.toLowerCase().includes(search.toLowerCase()) ||
                    req.repairOrderId?.toString().includes(search)
                );
            }

            setRequests(data);
            setTotalElements(data.length);
        } catch (error) {
            console.error("Error fetching requests:", error);
            console.error("Response data:", error.response?.data);
            console.error("Status:", error.response?.status);
            setMessage({
                type: "error",
                text: error.response?.data?.detail || "Lỗi tải danh sách yêu cầu",
            });
        } finally {
            setLoading(false);
        }

    };

    const handleOpenDialog = (request, type) => {
        setSelectedRequest(request);
        setActionType(type);
        setRejectReason("");
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedRequest(null);
        setActionType(null);
        setRejectReason("");
    };

    const handleConfirmAction = async () => {
        if (!selectedRequest) return;

        setActionLoading(true);
        try {
            if (actionType === "approve") {
                await approvePartRequest(selectedRequest.id);
                setMessage({
                    type: "success",
                    text: `Duyệt yêu cầu phụ tùng thành công`,
                });
            } else if (actionType === "reject") {
                if (!rejectReason.trim()) {
                    setMessage({
                        type: "error",
                        text: "Vui lòng nhập lý do từ chối",
                    });
                    setActionLoading(false);
                    return;
                }
                await rejectPartRequest(selectedRequest.id);
                setMessage({
                    type: "success",
                    text: `Từ chối yêu cầu phụ tùng thành công`,
                });
            }
            handleCloseDialog();
            fetchRequests();
        } catch (error) {
            console.error("Action error:", error);
            setMessage({
                type: "error",
                text: error.response?.data?.detail || "Lỗi xử lý yêu cầu",
            });
        } finally {
            setActionLoading(false);
        }


    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#3f51b5" }}>
                Duyệt Yêu Cầu Phụ Tùng </Typography>

            {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage({ type: "", text: "" })}>
                    {message.text}
                </Alert>
            )}

            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
                <TextField
                    placeholder="Tìm kiếm theo phụ tùng, mã phiếu..."
                    size="small"
                    sx={{ minWidth: 300 }}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <Box sx={{ display: "flex", gap: 1 }}>
                    {Object.entries(statusConfig).map(([key, value]) => (
                        <Button
                            key={key}
                            variant={statusFilter === key ? "contained" : "outlined"}
                            onClick={() => setStatusFilter(key)}
                        >
                            {value.label}
                        </Button>
                    ))}
                </Box>
            </Box>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Box sx={{ overflowX: "auto", backgroundColor: "#fff", borderRadius: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Phụ Tùng</TableCell>
                                    <TableCell align="center">SL</TableCell>
                                    <TableCell>Phiếu</TableCell>
                                    <TableCell>Trạng Thái</TableCell>
                                    <TableCell>Ngày</TableCell>
                                    <TableCell align="center">Hành Động</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {requests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell>#{request.id}</TableCell>

                                        <TableCell>{request.partName || "N/A"}</TableCell>

                                        <TableCell align="center">
                                            {request.requestedQuantity}
                                        </TableCell>

                                        <TableCell>#{request.repairOrderId || "N/A"}</TableCell>

                                        <TableCell>
                                            <Chip
                                                label={statusConfig[request.status]?.label || request.status}
                                                color={statusConfig[request.status]?.color || "default"}
                                                size="small"
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {dayjs(request.requestedAt).format("DD/MM/YYYY HH:mm")}
                                        </TableCell>

                                        <TableCell align="center">
                                            {request.status === "PENDING" && (
                                                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="success"
                                                        startIcon={<CheckCircleIcon />}
                                                        onClick={() => handleOpenDialog(request, "approve")}
                                                    >
                                                        Duyệt
                                                    </Button>

                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="error"
                                                        startIcon={<CancelIcon />}
                                                        onClick={() => handleOpenDialog(request, "reject")}
                                                    >
                                                        Từ chối
                                                    </Button>
                                                </Box>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>

                    {requests.length === 0 && (
                        <Box sx={{ textAlign: "center", py: 5 }}>
                            <Typography>Không có yêu cầu</Typography>
                        </Box>
                    )}
                </>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    {actionType === "approve" ? "Duyệt" : "Từ chối"}
                </DialogTitle>

                <DialogContent>
                    <Typography>Phụ tùng: {selectedRequest?.partName}</Typography>
                    <Typography>Số lượng: {selectedRequest?.requestedQuantity}</Typography>
                    <Typography>Phiếu: #{selectedRequest?.repairOrderId}</Typography>

                    {actionType === "reject" && (
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Lý do..."
                            sx={{ mt: 2 }}
                        />
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button onClick={handleConfirmAction} disabled={actionLoading}>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default PartRequests;
