package com.apnamart.order.mapper;

import com.apnamart.order.domain.Order;
import com.apnamart.order.domain.OrderItem;
import com.apnamart.order.dto.OrderDto;
import com.apnamart.order.dto.OrderItemDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target = "status", expression = "java(order.getStatus().name())")
    OrderDto toDto(Order order);

    @Mapping(target = "bookId", source = "book.id")
    OrderItemDto toItemDto(OrderItem item);
}
