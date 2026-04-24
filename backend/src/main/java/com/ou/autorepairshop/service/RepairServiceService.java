package com.ou.autorepairshop.service;

import com.ou.autorepairshop.dto.RepairServiceCreateRequest;
import com.ou.autorepairshop.dto.RepairServiceDTO;
import com.ou.autorepairshop.dto.RepairServiceRequest;
import com.ou.autorepairshop.entity.RepairService;
import com.ou.autorepairshop.entity.ServiceCategory;
import com.ou.autorepairshop.exception.ResourceNotFoundException;
import com.ou.autorepairshop.repository.RepairServiceRepository;
import com.ou.autorepairshop.repository.ReviewRepository;
import com.ou.autorepairshop.repository.ServiceCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RepairServiceService {

    private final RepairServiceRepository repository;
    private final ServiceCategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;

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

    public RepairServiceDTO create(RepairServiceCreateRequest request) {

        ServiceCategory category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        RepairService service = new RepairService();
        service.setName(request.name());
        service.setPrice(request.price());
        service.setDescription(request.description());
        service.setCategory(category);

        RepairService saved = repository.save(service);

        return new RepairServiceDTO(
                saved.getId(),
                saved.getName(),
                saved.getPrice(),
                saved.getDescription(),
                category.getId(),
                category.getName()
        );
    }

    public RepairServiceDTO update(Long id, RepairServiceRequest request) {

        RepairService existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        ServiceCategory category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        existing.setName(request.name());
        existing.setPrice(request.price());
        existing.setDescription(request.description());
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

    public Page<RepairServiceDTO> getServices(String search, Pageable pageable) {
        return repository.findAllWithCategoryDTO(search, pageable);
    }

    public Double getAverageRating(Long serviceId) {
        repository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        Double avg = reviewRepository.getAverageRatingByServiceId(serviceId);
        return avg != null ? avg : 0.0;
    }
}