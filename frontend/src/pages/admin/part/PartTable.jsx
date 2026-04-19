import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button,
  CircularProgress, Box
} from "@mui/material";

function PartTable({ parts, loading, onEdit, onDelete }) {
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

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tên phụ tùng</TableCell>
            <TableCell>Giá</TableCell>
            <TableCell>Số lượng tồn kho</TableCell>
            <TableCell>Mức tồn kho tối thiểu</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {parts.map(p => (
            <TableRow key={p.id}>
              <TableCell>{p.id}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.price}</TableCell>
              <TableCell>{p.stockQuantity}</TableCell>
              <TableCell>{p.minStockLevel}</TableCell>
              <TableCell>
                <Button onClick={() => onEdit(p)}>Sửa</Button>
                <Button color="error" onClick={() => onDelete(p.id)}>Xóa</Button>
              </TableCell>
            </TableRow>
          ))}

          {parts.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center">Không có dữ liệu</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PartTable;