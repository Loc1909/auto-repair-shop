import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper,
  Button, TablePagination, Box, CircularProgress
} from "@mui/material";

function ServiceTable({
  services,
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
    <Box sx={{ position: "relative" }}>
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>

        {loading && (
          <Box sx={{
            position: "absolute",
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
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Tên</b></TableCell>
              <TableCell><b>Giá</b></TableCell>
              <TableCell><b>Mô tả</b></TableCell>
              <TableCell><b>Danh mục</b></TableCell>
              <TableCell><b>Hành động</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {services.map(s => (
              <TableRow key={s.id} hover>
                <TableCell>{s.id}</TableCell>
                <TableCell>{s.name}</TableCell>
                <TableCell>
                  {s.price?.toLocaleString("vi-VN")} ₫
                </TableCell>
                <TableCell>{s.description}</TableCell>
                <TableCell>{s.categoryName}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => onEdit(s)} sx={{ mr: 1 }}>
                    Sửa
                  </Button>
                  <Button size="small" color="error" onClick={() => onDelete(s.id)}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {services.length === 0 && (
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
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 20]}
          labelRowsPerPage="Số dòng mỗi trang"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} trên ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </TableContainer>
    </Box>
  );
}

export default ServiceTable;