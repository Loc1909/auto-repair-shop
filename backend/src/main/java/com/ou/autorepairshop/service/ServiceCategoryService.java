package com.ou.autorepairshop.service;

import com.ou.autorepairshop.dto.ServiceCategoryDTO;
import com.ou.autorepairshop.entity.ServiceCategory;
import com.ou.autorepairshop.repository.ServiceCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceCategoryService {

    private final ServiceCategoryRepository repository;

    public List<ServiceCategoryDTO> getAll() {
        return repository.findAll()
                .stream()
                .map(c -> new ServiceCategoryDTO(
                        c.getId(),
                        c.getName(),
                        c.getDescription()
                ))
                .toList();
    }

    public ServiceCategory create(ServiceCategory c) {
        return repository.save(c);
    }
}