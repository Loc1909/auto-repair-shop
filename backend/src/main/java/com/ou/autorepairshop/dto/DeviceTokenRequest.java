package com.ou.autorepairshop.dto;

import lombok.Data;

@Data
public class DeviceTokenRequest {
    private Long userId;
    private String token;
    private String deviceType;
    private String deviceName;
}