package com.ou.autorepairshop.mapper;

import com.ou.autorepairshop.dto.AppointmentCreateRequest;
import com.ou.autorepairshop.dto.AppointmentResponse;
import com.ou.autorepairshop.dto.AppointmentResponseForEmployee;
import com.ou.autorepairshop.entity.Appointment;
import com.ou.autorepairshop.entity.Customer;
import com.ou.autorepairshop.entity.Employee;
import com.ou.autorepairshop.entity.Vehicle;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "PENDING")
    @Mapping(target = "vehicle", source = "vehicle")
    @Mapping(target = "assignedEmployee", source = "employee")
    Appointment toEntity(AppointmentCreateRequest request,
                         Customer customer,
                         Vehicle vehicle,
                         Employee employee);

    @Mapping(source = "customer.id", target = "customerId")
    @Mapping(source = "vehicle.licensePlate", target = "vehicleName")
    @Mapping(source = "assignedEmployee.id", target = "employeeId")
    @Mapping(target = "employeeName", source = "assignedEmployee.name", defaultValue = "")
    @Mapping(source = "status", target = "status")
    AppointmentResponse toResponse(Appointment appointment);
    List<AppointmentResponse> toResponseList(List<Appointment> appointments);
    default String mapVehicleName(Vehicle vehicle) {
        return vehicle != null ? vehicle.getLicensePlate() : null;
    }

    @Mapping(target = "customerId", source = "customer.id")
    @Mapping(target = "customerName", source = "customer.name")
    @Mapping(target = "vehicleId", source = "vehicle.id")
    @Mapping(target = "licensePlate", source = "vehicle.licensePlate")
    @Mapping(target = "assignedEmployeeId", source = "assignedEmployee.id")
    @Mapping(target = "assignedEmployeeName", source = "assignedEmployee.name")
    AppointmentResponseForEmployee toResponseForEmployee(Appointment appointment);

//    public AppointmentResponse toResponse(Appointment a) {
//        String customerName = null;
//
//        if (a.getCustomer() != null) {
//            customerName = a.getCustomer().getName();
//        }
//
//        return new AppointmentResponse(
//                a.getId(),
//                a.getStatus().name(),
//                customerName
//        );
//    }
}
