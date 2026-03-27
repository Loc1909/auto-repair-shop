import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper,
    Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField,
    CircularProgress, Box, Typography,
    FormControl, InputLabel, Select, MenuItem,
    FormGroup, FormControlLabel, Checkbox, Switch
} from "@mui/material";

const EVENT_TYPES = [
    "APPOINTMENT_REMINDER",
    "APPOINTMENT_CONFIRMED",
    "APPOINTMENT_CANCELLED",
    "REPAIR_UPDATE",
    "REPAIR_COMPLETE",
];

const CHANNELS = [
    "EMAIL",
    "SMS",
    "PUSH"
];

function NotificationConfig() {
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const [editingConfig, setEditingConfig] = useState(null);

    const [form, setForm] = useState({
        name: "",
        template: "",
        eventType: "",
        sendTimeOffset: 0,
        channels: [],
        status: true
    });

    // ================= FETCH =================
    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = () => {
        setLoading(true);
        axiosClient.get("/admin/notification-config")
            .then(res => setConfigs(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    // ================= DELETE =================
    const handleDelete = (id) => {
        if (!window.confirm("Xóa Notification Config này?")) return;

        axiosClient.delete(`/admin/notification-config/${id}`)
            .then(() => fetchConfigs())
            .catch(() => alert("Xóa thất bại"));
    };

    // ================= EDIT =================
    const handleOpenModal = (config = null) => {
        if (config) {
            setEditingConfig(config);
            setForm({
                name: config.name || "",
                template: config.template || "",
                eventType: config.eventType || "",
                sendTimeOffset: config.sendTimeOffset || 0,
                channels: config.channels || [],
                status: config.status === "ACTIVE" // map enum thành boolean cho Switch
            });
        } else {
            setEditingConfig(null);
            setForm({
                name: "",
                template: "",
                eventType: "",
                sendTimeOffset: 0,
                channels: [],
                status: true
            });
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => setOpenModal(false);

    // ================= SUBMIT =================
    const handleSubmit = () => {
        if (!form.name || !form.eventType) {
            alert("Vui lòng nhập Name và chọn Event Type");
            return;
        }

        // chuẩn hóa payload trước khi gửi
        const payload = {
            ...form,
            channels: form.channels || [],
            sendTimeOffset: parseInt(form.sendTimeOffset, 10) || 0,
            status: form.status ? "ACTIVE" : "INACTIVE"
        };

        const apiCall = editingConfig
            ? axiosClient.put(`/admin/notification-config/${editingConfig.id}`, payload)
            : axiosClient.post("/admin/notification-config", payload);

        apiCall
            .then(() => {
                fetchConfigs();
                setOpenModal(false);
            })
            .catch(err => {
                console.error(err.response?.data || err);
                alert("Lưu thất bại: kiểm tra console");
            });
    };

    const handleChannelChange = (channel) => {
        setForm(prev => {
            const channels = prev.channels.includes(channel)
                ? prev.channels.filter(c => c !== channel)
                : [...prev.channels, channel];
            return { ...prev, channels };
        });
    };

    // ================= UI =================
    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
                Notification Configs
            </Typography>

            <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpenModal()}>
                Add New
            </Button>

            <Box sx={{ position: "relative" }}>
                <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                    {loading && (
                        <Box sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            bgcolor: "rgba(255,255,255,0.6)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 1
                        }}>
                            <CircularProgress />
                        </Box>
                    )}

                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                                <TableCell><b>Name</b></TableCell>
                                <TableCell><b>Event Type</b></TableCell>
                                <TableCell><b>Channels</b></TableCell>
                                <TableCell><b>Send Time Offset</b></TableCell>
                                <TableCell><b>Status</b></TableCell>
                                <TableCell><b>Actions</b></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {configs.map(c => (
                                <TableRow key={c.id} hover>
                                    <TableCell>{c.name}</TableCell>
                                    <TableCell>{c.eventType}</TableCell>
                                    <TableCell>{c.channels?.join(", ")}</TableCell>
                                    <TableCell>{c.sendTimeOffset}</TableCell>
                                    <TableCell>{c.status}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                onClick={() => handleOpenModal(c)}
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleDelete(c.id)}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {configs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No data
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* MODAL */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>{editingConfig ? "Edit Notification Config" : "Add Notification Config"}</DialogTitle>

                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        label="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />

                    <TextField
                        label="Template"
                        value={form.template}
                        onChange={(e) => setForm({ ...form, template: e.target.value })}
                    />

                    <FormControl fullWidth>
                        <InputLabel>Event Type</InputLabel>
                        <Select
                            value={form.eventType}
                            label="Event Type"
                            onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                        >
                            {EVENT_TYPES.map(type => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Send Time Offset (minutes)"
                        type="number"
                        value={form.sendTimeOffset}
                        onChange={(e) => setForm({ ...form, sendTimeOffset: parseInt(e.target.value, 10) })}
                    />

                    <FormGroup row>
                        {CHANNELS.map(ch => (
                            <FormControlLabel
                                key={ch}
                                control={
                                    <Checkbox
                                        checked={form.channels.includes(ch)}
                                        onChange={() => handleChannelChange(ch)}
                                    />
                                }
                                label={ch}
                            />
                        ))}
                    </FormGroup>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.checked })}
                            />
                        }
                        label="Active"
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default NotificationConfig;