package com.ou.autorepairshop.service;

import com.ou.autorepairshop.dto.RepairServiceDTO;
import com.ou.autorepairshop.entity.RepairService;
import com.ou.autorepairshop.entity.ServiceCategory;
import com.ou.autorepairshop.repository.RepairServiceRepository;
import com.ou.autorepairshop.repository.ServiceCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RepairServiceService {

    private final RepairServiceRepository repository;
    private final ServiceCategoryRepository categoryRepository;

    public List<RepairServiceDTO> getAll() {
        return repository.findAllWithCategory()
                .stream()
                .map(s -> new RepairServiceDTO(
                        s.getId(),
                        s.getName(),
                        s.getPrice(),
                        s.getDescription(),
                        s.getCategory().getId(),
                        s.getCategory().getName()
                ))
                .toList();
    }

    public RepairService create(RepairService s) {

        Long categoryId = s.getCategory().getId();

        ServiceCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        s.setCategory(category);

        return repository.save(s);
    }

    public RepairServiceDTO update(Long id, RepairService s) {

        RepairService existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        if (s.getCategory() == null || s.getCategory().getId() == null) {
            throw new RuntimeException("Category is required");
        }

        ServiceCategory category = categoryRepository.findById(s.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        existing.setName(s.getName());
        existing.setPrice(s.getPrice());
        existing.setDescription(s.getDescription());
        existing.setCategory(category);

        RepairService saved = repository.save(existing);

        return new RepairServiceDTO(
                saved.getId(),
                saved.getName(),
                saved.getPrice(),
                saved.getDescription(),
                category.getId(),
                category.getName()
        );
    }

    public void delete(Long id) {

        if (!repository.existsById(id)) {
            throw new RuntimeException("Service not found");
        }

        repository.deleteById(id);
    }
    public RepairServiceDTO createAndReturnDTO(RepairService s) {

        if (s.getCategory() == null || s.getCategory().getId() == null) {
            throw new RuntimeException("Category is required");
        }

        Long categoryId = s.getCategory().getId();

        ServiceCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        s.setCategory(category);

        RepairService saved = repository.save(s);

        return new RepairServiceDTO(
                saved.getId(),
                saved.getName(),
                saved.getPrice(),
                saved.getDescription(),
                category.getId(),
                category.getName()
        );
    }
}