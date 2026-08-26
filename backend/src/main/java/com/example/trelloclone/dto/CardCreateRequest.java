package com.example.trelloclone.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CardCreateRequest(
        @NotNull Long listId,
        @NotBlank @Size(max = 50) String title,
        String description,
        @NotBlank String priority,
        LocalDate dueDate
) {
}
