package com.apnamart.catalog.service;

import com.apnamart.catalog.domain.Book;
import com.apnamart.catalog.dto.BookDto;
import com.apnamart.catalog.dto.CreateBookRequest;
import com.apnamart.catalog.mapper.BookMapper;
import com.apnamart.catalog.repository.BookRepository;
import com.apnamart.catalog.repository.CategoryRepository;
import com.apnamart.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final BookMapper bookMapper;

    public Page<BookDto> findAll(UUID categoryId, String search,
                                  BigDecimal minPrice, BigDecimal maxPrice,
                                  Boolean inStock, Pageable pageable) {
        return bookRepository.findWithFilters(categoryId, search, minPrice, maxPrice, inStock, pageable)
            .map(bookMapper::toDto);
    }

    public BookDto findById(UUID id) {
        return bookRepository.findById(id)
            .filter(Book::isActive)
            .map(bookMapper::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Book", id));
    }

    public BookDto findByIsbn(String isbn) {
        return bookRepository.findByIsbn(isbn)
            .filter(Book::isActive)
            .map(bookMapper::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Book with ISBN: " + isbn));
    }

    @Transactional
    public BookDto create(CreateBookRequest request) {
        var category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));

        Book book = Book.builder()
            .title(request.getTitle())
            .author(request.getAuthor())
            .isbn(request.getIsbn())
            .description(request.getDescription())
            .price(request.getPrice())
            .mrp(request.getMrp())
            .coverImageUrl(request.getCoverImageUrl())
            .publisher(request.getPublisher())
            .publishedYear(request.getPublishedYear())
            .language(request.getLanguage() != null ? request.getLanguage() : "English")
            .pages(request.getPages())
            .stockQuantity(request.getStockQuantity())
            .category(category)
            .build();

        return bookMapper.toDto(bookRepository.save(book));
    }

    @Transactional
    public BookDto updateStock(UUID id, int quantity) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Book", id));
        book.setStockQuantity(quantity);
        return bookMapper.toDto(bookRepository.save(book));
    }

    @Transactional
    public void delete(UUID id) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Book", id));
        book.setActive(false);
        bookRepository.save(book);
    }
}
