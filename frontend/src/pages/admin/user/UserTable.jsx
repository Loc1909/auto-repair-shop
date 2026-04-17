import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper,
  Button, CircularProgress, TablePagination, Box
} from "@mui/material";

function UserTable({
  users,
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
              <TableCell>Email</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Kích hoạt</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map(u => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{u.active ? "Có" : "Không"}</TableCell>
                <TableCell>
                  <Button onClick={() => onEdit(u)}>Sửa</Button>
                  <Button color="error" onClick={() => onDelete(u.id)}>Xóa</Button>
                </TableCell>
              </TableRow>
            ))}

            {users.length === 0 && (
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
          onPageChange={(e, p) => onPageChange(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
          labelRowsPerPage="Số dòng mỗi trang"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} trên ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </TableContainer>
    </Box>
  );
}

export default UserTable;