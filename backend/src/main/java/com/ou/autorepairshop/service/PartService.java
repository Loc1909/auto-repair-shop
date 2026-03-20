package com.ou.autorepairshop.service;

import com.ou.autorepairshop.entity.Part;
import com.ou.autorepairshop.repository.PartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PartService {

    private final PartRepository partRepository;

    public List<Part> getAll() {
        return partRepository.findAll();
    }

    public Part create(Part p) {
        return partRepository.save(p);
    }

    public Part update(Long id, Part p) {
        Part existing = partRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Part not found"));

        existing.setName(p.getName());
        existing.setPrice(p.getPrice());
        existing.setStockQuantity(p.getStockQuantity());
        existing.setMinStockLevel(p.getMinStockLevel());

        return partRepository.save(existing);
    }

    public void delete(Long id) {
        partRepository.deleteById(id);
    }

    // 🔥 low stock
    public List<Part> getLowStock() {
        return partRepository.findByStockQuantityLessThan(10);
    }
}