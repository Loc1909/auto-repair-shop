package com.ou.autorepairshop.service;

import com.ou.autorepairshop.dto.VehicleRequest;
import com.ou.autorepairshop.dto.VehicleResponse;
import com.ou.autorepairshop.entity.Customer;
import com.ou.autorepairshop.entity.Vehicle;
import com.ou.autorepairshop.exception.DuplicateResourceException;
import com.ou.autorepairshop.exception.ResourceNotFoundException;
import com.ou.autorepairshop.repository.CustomerRepository;
import com.ou.autorepairshop.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final CustomerRepository customerRepository;

    public List<VehicleResponse> getAll() {
        return vehicleRepository.findAll().stream()
                .map(v -> new VehicleResponse(
                        v.getId(),
                        v.getLicensePlate(),
                        v.getBrand(),
                        v.getModel(),
                        v.getYear(),
                        v.getCustomer().getId()
                )).toList();
    }

    public VehicleResponse getById(Long id) {
        Vehicle v = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        return new VehicleResponse(
                v.getId(),
                v.getLicensePlate(),
                v.getBrand(),
                v.getModel(),
                v.getYear(),
                v.getCustomer().getId());
    }

    public VehicleResponse createVehicle(VehicleRequest request) {
        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (vehicleRepository.existsByLicensePlate(request.licensePlate())) {
            throw new DuplicateResourceException("This license plate is exists");
        }

        Vehicle v = new Vehicle();
        v.setLicensePlate(request.licensePlate());
        v.setBrand(request.brand());
        v.setModel(request.model());
        v.setYear(request.year());
        v.setCustomer(customer);
        Vehicle vehicle = vehicleRepository.save(v);
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getLicensePlate(),
                vehicle.getBrand(),
                vehicle.getModel(),
                vehicle.getYear(),
                vehicle.getCustomer().getId());
    }

    public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
        Vehicle v = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        v.setLicensePlate(request.licensePlate());
        v.setBrand(request.brand());
        v.setModel(request.model());
        v.setYear(request.year());

        Vehicle vehicle = vehicleRepository.save(v);

        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getLicensePlate(),
                vehicle.getBrand(),
                vehicle.getModel(),
                vehicle.getYear(),
                vehicle.getCustomer().getId());
    }

    public VehicleResponse patchVehicle(Long id, VehicleRequest request) {
        Vehicle v = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        if (request.licensePlate() != null) v.setLicensePlate(request.licensePlate());
        if (request.brand() != null) v.setBrand(request.brand());
        if (request.model() != null) v.setModel(request.model());
        if (request.year() != null) v.setYear(request.year());

        Vehicle vehicle = vehicleRepository.save(v);

        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getLicensePlate(),
                vehicle.getBrand(),
                vehicle.getModel(),
                vehicle.getYear(),
                vehicle.getCustomer().getId());
    }

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }
}
