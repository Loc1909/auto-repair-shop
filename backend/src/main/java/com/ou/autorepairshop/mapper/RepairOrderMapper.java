package com.ou.autorepairshop.mapper;

import com.ou.autorepairshop.entity.RepairOrder;
import com.ou.autorepairshop.dto.RepairOrderResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueCheckStrategy;

@Mapper(componentModel = "spring", nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface RepairOrderMapper {
    @Mapping(source = "vehicle.id", target = "vehicleId")
    @Mapping(source = "vehicle.licensePlate", target = "vehicleLicensePlate")
    @Mapping(source = "vehicle.brand", target = "vehicleBrand")
    @Mapping(source = "vehicle.model", target = "vehicleModel")
    @Mapping(source = "employee.id", target = "employeeId")
    @Mapping(source = "employee.name", target = "employeeName")
    @Mapping(source = "appointment.id", target = "appointmentId")
    RepairOrderResponse toResponse(RepairOrder repairOrder);
}
