package com.bm.discount.service;

import com.bm.discount.database.pojo.Product;
import com.bm.discount.repo.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Sort;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    public Product save(Product product) {
        if (product.getPrice() != null && product.getPrice() < 0) {
            throw new RuntimeException("Cena proizvoda ne može biti negativna!");
        }
        return productRepository.save(product);
    }

    public Product update(Long id, Product details) {
        return productRepository.findById(id).map(product -> {
            product.setProductName(details.getProductName());
            product.setPrice(details.getPrice());
            product.setCategory(details.getCategory());
            product.setCompany(details.getCompany());
            product.setProductUrl(details.getProductUrl());
            return productRepository.save(product);
        }).orElse(null);
    }

    public boolean deleteById(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Product> getAllProducts(String search, String sortBy) {
        // Podrazumevano sortiranje je po ID-ju (rastuće)
        Sort sort = Sort.by("productId").ascending();

        if ("priceAsc".equals(sortBy)) {
            sort = Sort.by("price").ascending();
        } else if ("priceDesc".equals(sortBy)) {
            sort = Sort.by("price").descending();
        } else if ("nameAsc".equals(sortBy)) {
            sort = Sort.by("productName").ascending();
        }

        // Ako je search prazan, poslaće se "" što će vratiti sve proizvode
        return productRepository.findByProductNameContainingIgnoreCase(search, sort);
    }
}
