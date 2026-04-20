package com.ou.autorepairshop.service;

import com.ou.autorepairshop.dto.ServiceCategoryDTO;
import com.ou.autorepairshop.entity.ServiceCategory;
import com.ou.autorepairshop.repository.ServiceCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceCategoryService {

    private final ServiceCategoryRepository repository;

    // ================= READ =================

    public Page<ServiceCategoryDTO> getCategories(String search, Pageable pageable) {
        Page<ServiceCategory> page = (search != null && !search.trim().isEmpty())
                ? repository.search(search, pageable)
                : repository.findAll(pageable);

        return page.map(this::toDTO);
    }

    public List<ServiceCategoryDTO> getAll() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // ================= CREATE =================

    public ServiceCategoryDTO create(ServiceCategory c) {
        ServiceCategory saved = repository.save(c);
        return toDTO(saved);
    }

    // ================= UPDATE =================

    public ServiceCategoryDTO update(Long id, ServiceCategory c) {
        ServiceCategory existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        existing.setName(c.getName());
        existing.setDescription(c.getDescription());

        return toDTO(repository.save(existing));
    }

    // ================= DELETE =================

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Category not found");
        }
        repository.deleteById(id);
    }

    // ================= MAPPER =================

    private ServiceCategoryDTO toDTO(ServiceCategory c) {
        return new ServiceCategoryDTO(
                c.getId(),
                c.getName(),
                c.getDescription()
        );
    }
}