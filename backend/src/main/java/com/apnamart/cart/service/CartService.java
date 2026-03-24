package com.apnamart.cart.service;

import com.apnamart.cart.domain.Cart;
import com.apnamart.cart.domain.CartItem;
import com.apnamart.cart.dto.AddToCartRequest;
import com.apnamart.cart.dto.CartDto;
import com.apnamart.cart.mapper.CartMapper;
import com.apnamart.cart.repository.CartItemRepository;
import com.apnamart.cart.repository.CartRepository;
import com.apnamart.catalog.domain.Book;
import com.apnamart.catalog.repository.BookRepository;
import com.apnamart.common.exception.BusinessException;
import com.apnamart.common.exception.ResourceNotFoundException;
import com.apnamart.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;
    private final CartMapper cartMapper;

    public CartDto getCart(User user) {
        Cart cart = getOrCreateCart(user);
        return cartMapper.toDto(cart);
    }

    @Transactional
    public CartDto addItem(User user, AddToCartRequest request) {
        Book book = bookRepository.findById(request.getBookId())
            .filter(Book::isActive)
            .orElseThrow(() -> new ResourceNotFoundException("Book", request.getBookId()));

        if (book.getStockQuantity() < request.getQuantity()) {
            throw new BusinessException("Insufficient stock. Available: " + book.getStockQuantity());
        }

        Cart cart = getOrCreateCart(user);

        cartItemRepository.findByCartIdAndBookId(cart.getId(), book.getId())
            .ifPresentOrElse(
                existing -> existing.setQuantity(existing.getQuantity() + request.getQuantity()),
                () -> {
                    CartItem newItem = CartItem.builder()
                        .cart(cart)
                        .book(book)
                        .quantity(request.getQuantity())
                        .unitPrice(book.getPrice())
                        .build();
                    cart.getItems().add(newItem);
                }
            );

        return cartMapper.toDto(cartRepository.save(cart));
    }

    @Transactional
    public CartDto updateItem(User user, UUID itemId, int quantity) {
        Cart cart = getOrCreateCart(user);
        CartItem item = cart.getItems().stream()
            .filter(i -> i.getId().equals(itemId))
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("Cart item", itemId));

        if (quantity <= 0) {
            cart.getItems().remove(item);
        } else {
            item.setQuantity(quantity);
        }

        return cartMapper.toDto(cartRepository.save(cart));
    }

    @Transactional
    public CartDto removeItem(User user, UUID itemId) {
        Cart cart = getOrCreateCart(user);
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        return cartMapper.toDto(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(User user) {
        cartRepository.findByUserId(user.getId()).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepository.save(cart);
        });
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
            .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
    }
}
