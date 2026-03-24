package com.apnamart.catalog.mapper;

import com.apnamart.catalog.domain.Category;
import com.apnamart.catalog.dto.CategoryDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryDto toDto(Category category);
}
