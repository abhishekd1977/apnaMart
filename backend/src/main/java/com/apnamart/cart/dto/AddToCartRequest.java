package com.apnamart.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class AddToCartRequest {
    @NotNull
    private UUID bookId;

    @NotNull
    @Min(1)
    private Integer quantity;
}
