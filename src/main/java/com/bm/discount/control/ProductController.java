package com.bm.discount.control;

import com.bm.discount.database.pojo.Product;
import com.bm.discount.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // GET all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAll();
    }

    // GET product by ID - Korišćenje ResponseEntity je čistija praksa
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE new product
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.save(product);
    }

    // UPDATE product - Sva logika prebačena na servis
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product updatedProduct = productService.update(id, productDetails);
        if (updatedProduct != null) {
            return ResponseEntity.ok(updatedProduct);
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE product - Vraća odgovarajući HTTP status u zavisnosti od uspeha
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (productService.deleteById(id)) {
            return ResponseEntity.noContent().build(); // Status 204
        }
        return ResponseEntity.notFound().build(); // Status 404
    }

    // GET products by category
    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryId) {
        // Umesto povlačenja svih pa filtriranja, u ProductService i ProductRepository 
        // možeš uvesti metodu findByCategory(Category category) radi brzine.
        // Za sada tvoje rešenje radi, ali evo kako da ga ostaviš preko servisa:
        return productService.getAll().stream()
                .filter(p -> p.getCategory() != null && p.getCategory().getCategoryId().equals(categoryId))
                .toList();
    }
}
