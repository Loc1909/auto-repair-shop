package com.ou.autorepairshop.dto;

import com.ou.autorepairshop.enums.RepairStatus;

import java.util.List;

public record RepairOrderTrackingResponse(Long repairOrderId,
                                          RepairStatus currentStatus,
                                          List<RepairProgressResponse> history
) {
}