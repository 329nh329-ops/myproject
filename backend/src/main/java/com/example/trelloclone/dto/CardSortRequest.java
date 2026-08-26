package com.example.trelloclone.dto;

import jakarta.validation.constraints.NotBlank;

public record CardSortRequest(
        @NotBlank String sortBy
) {
}
