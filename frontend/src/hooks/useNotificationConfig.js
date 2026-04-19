import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export const useNotificationConfig = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/admin/notification-config", {
        params: {
          page,
          size: rowsPerPage
        }
      });

      setConfigs(res.data.content);
      setTotalElements(res.data.totalElements);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteConfig = async (id) => {
    await axiosClient.delete(`/admin/notification-config/${id}`);
    fetchConfigs();
  };

  const saveConfig = async (data, editingConfig) => {
    const payload = {
      name: data.name,
      eventType: data.eventType,
      channels: data.channels || [],
      sendTimeOffset: parseInt(data.sendTimeOffset, 10) || 0,
      status: data.status ? "ACTIVE" : "INACTIVE",
      templateEmail: data.emailTemplate,
      templatePush: data.pushTemplate
    };

    if (editingConfig) {
      await axiosClient.put(`/admin/notification-config/${editingConfig.id}`, payload);
    } else {
      await axiosClient.post("/admin/notification-config", payload);
    }

    fetchConfigs();
  };

  useEffect(() => {
    fetchConfigs();
  }, [page, rowsPerPage]);

  return {
    configs,
    loading,
    page,
    rowsPerPage,
    totalElements,
    setPage,
    setRowsPerPage,
    fetchConfigs,
    deleteConfig,
    saveConfig
  };
};