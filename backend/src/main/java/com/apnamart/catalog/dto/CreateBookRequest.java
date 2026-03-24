package com.apnamart.catalog.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CreateBookRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String author;

    private String isbn;

    private String description;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal price;

    private BigDecimal mrp;
    private String coverImageUrl;
    private String publisher;
    private Short publishedYear;
    private String language;
    private Integer pages;

    @NotNull
    @Min(0)
    private Integer stockQuantity;

    @NotNull
    private UUID categoryId;
}
