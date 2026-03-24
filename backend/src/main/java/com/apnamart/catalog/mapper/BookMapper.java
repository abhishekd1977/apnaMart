package com.apnamart.catalog.mapper;

import com.apnamart.catalog.domain.Book;
import com.apnamart.catalog.dto.BookDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class})
public interface BookMapper {

    @Mapping(target = "category", source = "category")
    BookDto toDto(Book book);
}
