package com.apnamart.catalog;

import com.apnamart.catalog.domain.Book;
import com.apnamart.catalog.domain.Category;
import com.apnamart.catalog.dto.BookDto;
import com.apnamart.catalog.mapper.BookMapper;
import com.apnamart.catalog.repository.BookRepository;
import com.apnamart.catalog.service.BookService;
import com.apnamart.catalog.repository.CategoryRepository;
import com.apnamart.common.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private BookMapper bookMapper;

    @InjectMocks
    private BookService bookService;

    private UUID bookId;
    private Book book;
    private BookDto bookDto;

    @BeforeEach
    void setUp() {
        bookId = UUID.randomUUID();

        Category category = Category.builder()
            .id(UUID.randomUUID())
            .name("Technology")
            .slug("technology")
            .build();

        book = Book.builder()
            .id(bookId)
            .title("Clean Code")
            .author("Robert C. Martin")
            .price(new BigDecimal("699.00"))
            .stockQuantity(50)
            .isActive(true)
            .category(category)
            .build();

        bookDto = new BookDto();
        bookDto.setId(bookId);
        bookDto.setTitle("Clean Code");
    }

    @Test
    void findById_returnsBook_whenExists() {
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));
        when(bookMapper.toDto(book)).thenReturn(bookDto);

        BookDto result = bookService.findById(bookId);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(bookId);
        assertThat(result.getTitle()).isEqualTo("Clean Code");
    }

    @Test
    void findById_throwsNotFound_whenBookDoesNotExist() {
        UUID unknownId = UUID.randomUUID();
        when(bookRepository.findById(unknownId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookService.findById(unknownId))
            .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void findById_throwsNotFound_whenBookIsInactive() {
        book.setActive(false);
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));

        assertThatThrownBy(() -> bookService.findById(bookId))
            .isInstanceOf(ResourceNotFoundException.class);
    }
}
