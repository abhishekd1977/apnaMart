package com.apnamart.cart.mapper;

import com.apnamart.cart.domain.Cart;
import com.apnamart.cart.domain.CartItem;
import com.apnamart.cart.dto.CartDto;
import com.apnamart.cart.dto.CartItemDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;
import java.util.List;

@Mapper(componentModel = "spring")
public interface CartMapper {

    @Mapping(target = "items", source = "items")
    @Mapping(target = "total", expression = "java(calculateTotal(cart.getItems()))")
    @Mapping(target = "itemCount", expression = "java(cart.getItems().size())")
    CartDto toDto(Cart cart);

    @Mapping(target = "bookId", source = "book.id")
    @Mapping(target = "bookTitle", source = "book.title")
    @Mapping(target = "bookAuthor", source = "book.author")
    @Mapping(target = "coverImageUrl", source = "book.coverImageUrl")
    @Mapping(target = "subtotal", expression = "java(item.getUnitPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())))")
    CartItemDto toItemDto(CartItem item);

    List<CartItemDto> toItemDtoList(List<CartItem> items);

    default BigDecimal calculateTotal(List<CartItem> items) {
        return items.stream()
            .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
