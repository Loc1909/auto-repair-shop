import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import NotificationTable from "./NotificationTable";
import NotificationFormDialog from "./NotificationFormDialog";
import { useNotificationConfig } from "../../../hooks/useNotificationConfig";

function NotificationConfig() {
    const {
        configs,
        loading,
        page,
        rowsPerPage,
        totalElements,
        setPage,
        setRowsPerPage,
        deleteConfig,
        saveConfig
    } = useNotificationConfig();

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" ,color: "#3f51b5"}}>
                Quản lý cấu hình thông báo
            </Typography>

            <Button
                variant="contained"
                sx={{ mb: 2 }}
                onClick={() => { setEditing(null); setOpen(true); }}
            >
                Thêm cấu hình
            </Button>

            <NotificationTable
                configs={configs}
                loading={loading}
                onEdit={(c) => { setEditing(c); setOpen(true); }}
                onDelete={deleteConfig}
                page={page}
                rowsPerPage={rowsPerPage}
                totalElements={totalElements}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}

            />

            <NotificationFormDialog
                open={open}
                onClose={() => setOpen(false)}
                editingConfig={editing}
                onSubmit={(data) => {
                    saveConfig(data, editing);
                    setOpen(false);
                }}
            />
        </Box>
    );
}

export default NotificationConfig;