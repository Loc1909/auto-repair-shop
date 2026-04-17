import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Box,
  CircularProgress, TablePagination
} from "@mui/material";

function NotificationTable({
  configs,
  loading,
  page,
  rowsPerPage,
  totalElements,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete
}) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, position: "relative" }}>

      {loading && (
        <Box sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(255,255,255,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1
        }}>
          <CircularProgress />
        </Box>
      )}

      <Table
        sx={{
          "& .MuiTableCell-root": {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Tên</TableCell>
            <TableCell>Loại sự kiện</TableCell>
            <TableCell>Kênh</TableCell>
            <TableCell>Thời gian (phút)</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {configs.map(c => (
            <TableRow key={c.id}>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.eventType}</TableCell>
              <TableCell>{c.channels?.join(", ")}</TableCell>
              <TableCell>{c.sendTimeOffset}</TableCell>
              <TableCell>{c.status}</TableCell>
              <TableCell>
                <Button onClick={() => onEdit(c)}>Sửa</Button>
                <Button color="error" onClick={() => onDelete(c.id)}>Xóa</Button>
              </TableCell>
            </TableRow>
          ))}

          {configs.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        onPageChange={(e, newPage) => onPageChange(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          onRowsPerPageChange(parseInt(e.target.value, 10));
          onPageChange(0);
        }}
        labelRowsPerPage="Số dòng mỗi trang"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} trên ${count !== -1 ? count : `hơn ${to}`}`
        }
      />
    </TableContainer>
  );
}

export default NotificationTable;