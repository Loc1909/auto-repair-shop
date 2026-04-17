import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper,
  Button, CircularProgress, TablePagination, Box
} from "@mui/material";

function EmployeeTable({
  employees,
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

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên người dùng</TableCell>
              <TableCell>Họ và tên</TableCell>
              <TableCell>Điện thoại</TableCell>
              <TableCell>Chức vụ</TableCell>
              <TableCell>Lương</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {employees.map(e => (
              <TableRow key={e.id}>
                <TableCell>{e.id}</TableCell>
                <TableCell>{e.username}</TableCell>
                <TableCell>{e.name}</TableCell>
                <TableCell>{e.phone}</TableCell>
                <TableCell>{e.position}</TableCell>
                <TableCell>
                  {e.salary?.toLocaleString("vi-VN")} ₫
                </TableCell>
                <TableCell>
                  <Button onClick={() => onEdit(e)}>Sửa</Button>
                  <Button color="error" onClick={() => onDelete(e.id)}>Xóa</Button>
                </TableCell>
              </TableRow>
            ))}

            {employees.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
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
          onPageChange={(e, p) => onPageChange(p)}
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
    </Box>
  );
}

export default EmployeeTable;