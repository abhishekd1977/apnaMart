package com.apnamart.order.service;

import com.apnamart.cart.domain.CartItem;
import com.apnamart.cart.repository.CartRepository;
import com.apnamart.common.exception.BusinessException;
import com.apnamart.common.exception.ResourceNotFoundException;
import com.apnamart.order.domain.Order;
import com.apnamart.order.domain.OrderItem;
import com.apnamart.order.domain.OrderStatus;
import com.apnamart.order.dto.OrderDto;
import com.apnamart.order.dto.PlaceOrderRequest;
import com.apnamart.order.mapper.OrderMapper;
import com.apnamart.order.repository.OrderRepository;
import com.apnamart.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final OrderMapper orderMapper;

    @Transactional
    public OrderDto placeOrder(User user, PlaceOrderRequest request) {
        var cart = cartRepository.findByUserId(user.getId())
            .orElseThrow(() -> new BusinessException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BusinessException("Cannot place order with empty cart");
        }

        List<OrderItem> orderItems = cart.getItems().stream()
            .map(cartItem -> buildOrderItem(cartItem))
            .toList();

        BigDecimal total = orderItems.stream()
            .map(OrderItem::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
            .user(user)
            .totalAmount(total)
            .finalAmount(total)
            .shippingAddress(request.getShippingAddress())
            .paymentMethod(request.getPaymentMethod())
            .notes(request.getNotes())
            .build();

        orderItems.forEach(item -> item.setOrder(order));
        order.getItems().addAll(orderItems);

        Order saved = orderRepository.save(order);

        // Clear cart after successful order placement
        cart.getItems().clear();
        cartRepository.save(cart);

        return orderMapper.toDto(saved);
    }

    public Page<OrderDto> findByUser(User user, Pageable pageable) {
        return orderRepository.findByUserId(user.getId(), pageable)
            .map(orderMapper::toDto);
    }

    public OrderDto findById(User user, UUID orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Order", orderId);
        }

        return orderMapper.toDto(order);
    }

    private OrderItem buildOrderItem(CartItem cartItem) {
        BigDecimal subtotal = cartItem.getUnitPrice()
            .multiply(BigDecimal.valueOf(cartItem.getQuantity()));

        return OrderItem.builder()
            .book(cartItem.getBook())
            .title(cartItem.getBook().getTitle())
            .author(cartItem.getBook().getAuthor())
            .quantity(cartItem.getQuantity())
            .unitPrice(cartItem.getUnitPrice())
            .subtotal(subtotal)
            .build();
    }
}
