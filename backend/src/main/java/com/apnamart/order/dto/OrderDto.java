package com.apnamart.order.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
public class OrderDto {
    private UUID id;
    private String status;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal shippingAmount;
    private BigDecimal finalAmount;
    private String paymentMethod;
    private String paymentStatus;
    private Map<String, String> shippingAddress;
    private String notes;
    private List<OrderItemDto> items;
    private Instant orderedAt;
}
