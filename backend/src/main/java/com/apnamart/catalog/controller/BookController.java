package com.apnamart.catalog.controller;

import com.apnamart.catalog.dto.BookDto;
import com.apnamart.catalog.dto.CreateBookRequest;
import com.apnamart.catalog.service.BookService;
import com.apnamart.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping("/api/v1/books")
    public ResponseEntity<ApiResponse<Page<BookDto>>> findAll(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(
            bookService.findAll(categoryId, search, minPrice, maxPrice, inStock, pageable)));
    }

    @GetMapping("/api/v1/books/{id}")
    public ResponseEntity<ApiResponse<BookDto>> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(bookService.findById(id)));
    }

    @GetMapping("/api/v1/books/isbn/{isbn}")
    public ResponseEntity<ApiResponse<BookDto>> findByIsbn(@PathVariable String isbn) {
        return ResponseEntity.ok(ApiResponse.ok(bookService.findByIsbn(isbn)));
    }

    @PostMapping("/api/v1/admin/books")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookDto>> create(@Valid @RequestBody CreateBookRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(bookService.create(request)));
    }

    @PatchMapping("/api/v1/admin/books/{id}/stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookDto>> updateStock(
            @PathVariable UUID id,
            @RequestBody Map<String, Integer> body) {
        return ResponseEntity.ok(ApiResponse.ok(bookService.updateStock(id, body.get("quantity"))));
    }

    @DeleteMapping("/api/v1/admin/books/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
