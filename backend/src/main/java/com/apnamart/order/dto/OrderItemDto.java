package com.apnamart.order.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class OrderItemDto {
    private UUID id;
    private UUID bookId;
    private String title;
    private String author;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
}
