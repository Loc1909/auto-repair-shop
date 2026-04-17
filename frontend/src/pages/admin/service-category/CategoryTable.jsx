import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper,
  Button, CircularProgress, TablePagination, Box
} from "@mui/material";

function CategoryTable({
  categories,
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
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Tên</b></TableCell>
              <TableCell><b>Mô tả</b></TableCell>
              <TableCell><b>Hành động</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categories.map(c => (
              <TableRow key={c.id} hover>
                <TableCell>{c.id}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.description}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => onEdit(c)} sx={{ mr: 1 }}>
                    Sửa
                  </Button>
                  <Button size="small" color="error" onClick={() => onDelete(c.id)}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
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
    </Box>
  );
}

export default CategoryTable;