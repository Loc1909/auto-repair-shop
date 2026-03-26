package com.ou.autorepairshop.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiError(
        String error,
        String message,
        List<FieldErrorDetail> details,
        String path,
        Instant timestamp
) {
    public record FieldErrorDetail(String field, String message) {
    }
}
