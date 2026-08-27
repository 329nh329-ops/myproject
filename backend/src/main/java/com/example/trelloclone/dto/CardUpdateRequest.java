package com.example.trelloclone.dto;

import com.example.trelloclone.entity.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CardUpdateRequest(
        @NotBlank @Size(max = 50) String title,
        String description,
        @NotNull Priority priority,
        LocalDate dueDate
) {
}
