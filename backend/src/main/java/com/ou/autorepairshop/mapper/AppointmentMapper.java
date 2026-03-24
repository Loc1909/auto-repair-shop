package com.ou.autorepairshop.mapper;

import com.ou.autorepairshop.dto.AppointmentResponse;
import com.ou.autorepairshop.entity.Appointment;
import org.springframework.stereotype.Component;

@Component
public class AppointmentMapper {

    public AppointmentResponse toResponse(Appointment a) {
        String customerName = null;

        if (a.getCustomer() != null) {
            customerName = a.getCustomer().getName();
        }

        return new AppointmentResponse(
                a.getId(),
                a.getStatus().name(),
                customerName
        );
    }
}