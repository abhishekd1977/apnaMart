package com.apnamart.catalog.repository;

import com.apnamart.catalog.domain.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

public interface BookRepository extends JpaRepository<Book, UUID> {

    Optional<Book> findByIsbn(String isbn);

    @Query("""
        SELECT b FROM Book b
        WHERE b.isActive = true
          AND (:categoryId IS NULL OR b.category.id = :categoryId)
          AND (:search IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%'))
               OR LOWER(b.author) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))
          AND (:minPrice IS NULL OR b.price >= :minPrice)
          AND (:maxPrice IS NULL OR b.price <= :maxPrice)
          AND (:inStock IS NULL OR (:inStock = true AND b.stockQuantity > 0)
               OR (:inStock = false AND b.stockQuantity = 0))
        """)
    Page<Book> findWithFilters(
        @Param("categoryId") UUID categoryId,
        @Param("search") String search,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("inStock") Boolean inStock,
        Pageable pageable
    );
}
