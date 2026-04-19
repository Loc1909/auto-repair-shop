import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper,
  Button, CircularProgress, TablePagination, Box
} from "@mui/material";

function CustomerTable({
  customers,
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
              <TableCell>Tên</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {customers.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.address}</TableCell>
                <TableCell>
                  <Button onClick={() => onEdit(c)}>Sửa</Button>
                  <Button color="error" onClick={() => onDelete(c.id)}>Xóa</Button>
                </TableCell>
              </TableRow>
            ))}

            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
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

export default CustomerTable;