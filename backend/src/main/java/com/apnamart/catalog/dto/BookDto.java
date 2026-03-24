package com.apnamart.catalog.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class BookDto {
    private UUID id;
    private String title;
    private String author;
    private String isbn;
    private String description;
    private BigDecimal price;
    private BigDecimal mrp;
    private String coverImageUrl;
    private String publisher;
    private Short publishedYear;
    private String language;
    private Integer pages;
    private Integer stockQuantity;
    private CategoryDto category;
}
