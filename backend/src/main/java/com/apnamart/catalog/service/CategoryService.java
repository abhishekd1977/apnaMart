package com.apnamart.catalog.service;

import com.apnamart.catalog.dto.CategoryDto;
import com.apnamart.catalog.mapper.CategoryMapper;
import com.apnamart.catalog.repository.CategoryRepository;
import com.apnamart.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public List<CategoryDto> findAll() {
        return categoryRepository.findAll().stream()
            .map(categoryMapper::toDto)
            .toList();
    }

    public CategoryDto findById(UUID id) {
        return categoryRepository.findById(id)
            .map(categoryMapper::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Category", id));
    }
}
