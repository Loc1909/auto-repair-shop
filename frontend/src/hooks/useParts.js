import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export const useParts = (page, rowsPerPage, search) => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  const fetchParts = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/admin/parts", {
        params: { page, size: rowsPerPage, search }
      });
      setParts(res.data.content);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deletePart = async (id) => {
    await axiosClient.delete(`/admin/parts/${id}`);
    fetchParts();
  };

  const savePart = async (data, editingPart) => {
    if (editingPart) {
      await axiosClient.put(`/admin/parts/${editingPart.id}`, data);
    } else {
      await axiosClient.post("/admin/parts", data);
    }
    fetchParts();
  };

  useEffect(() => {
    fetchParts();
  }, [page, rowsPerPage, search]);

  return {
    parts,
    loading,
    totalElements,
    fetchParts,
    deletePart,
    savePart
  };
};