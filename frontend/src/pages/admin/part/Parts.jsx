import { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, TablePagination } from "@mui/material";
import { useParts } from "../../../hooks/useParts";
import PartTable from "./PartTable";
import PartFormDialog from "./PartFormDialog";

function Parts() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const { parts, loading, totalElements, deletePart, savePart } =
    useParts(page, rowsPerPage, search);

  // debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchInput]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>Quản lý kho phụ tùng</Typography>

      <TextField
        placeholder="Tìm kiếm phụ tùng..."
        fullWidth
        sx={{ mb: 2 }}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      <Button variant="contained" sx={{ mb: 2 }} onClick={() => { setEditing(null); setOpen(true); }}>
        Thêm phụ tùng
      </Button>

      <PartTable
        parts={parts}
        loading={loading}
        onEdit={(p) => { setEditing(p); setOpen(true); }}
        onDelete={(id) => deletePart(id)}
      />

      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        onPageChange={(e, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Số dòng mỗi trang"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} trên ${count !== -1 ? count : `hơn ${to}`}`
        }
      />

      <PartFormDialog
        open={open}
        onClose={() => setOpen(false)}
        editingPart={editing}
        onSubmit={(data) => {
          savePart(data, editing);
          setOpen(false);
        }}
      />
    </Box>
  );
}

export default Parts;