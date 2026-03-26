package com.ou.autorepairshop.mapper;

import com.ou.autorepairshop.dto.AppointmentCreateRequest;
import com.ou.autorepairshop.dto.AppointmentResponse;
import com.ou.autorepairshop.entity.Appointment;
import com.ou.autorepairshop.entity.Customer;
import com.ou.autorepairshop.entity.Employee;
import com.ou.autorepairshop.entity.Vehicle;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "PENDING")
    Appointment toEntity(AppointmentCreateRequest request,
                         Customer customer,
                         Vehicle vehicle,
                         Employee employee);

    @Mapping(source = "customer.id", target = "customerId")
    @Mapping(source = "vehicle.id", target = "vehicleId")
    @Mapping(source = "assignedEmployee.id", target = "employeeId")
    AppointmentResponse toResponse(Appointment appointment);

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
