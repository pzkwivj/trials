package com.bm.discount.service;

import com.bm.discount.database.pojo.Category;
import com.bm.discount.repo.CategoryRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category save(Category category) {
        // Ovde možemo dodati validaciju specifičnu za biznis logiku ako zatreba
        return categoryRepository.save(category);
    }

    public Category update(Long id, Category details) {
        return categoryRepository.findById(id).map(category -> {
            category.setCategoryName(details.getCategoryName());
            return categoryRepository.save(category);
        }).orElse(null);
    }

    public boolean deleteById(Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
