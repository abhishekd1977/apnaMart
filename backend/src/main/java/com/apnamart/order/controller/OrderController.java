package com.apnamart.order.controller;

import com.apnamart.common.response.ApiResponse;
import com.apnamart.order.dto.OrderDto;
import com.apnamart.order.dto.PlaceOrderRequest;
import com.apnamart.order.service.OrderService;
import com.apnamart.user.domain.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderDto>> placeOrder(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody PlaceOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Order placed successfully", orderService.placeOrder(user, request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrderDto>>> getOrders(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 10, sort = "orderedAt") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.findByUser(user, pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrder(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.findById(user, id)));
    }
}
