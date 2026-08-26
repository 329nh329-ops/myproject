package com.example.trelloclone.dto;

import jakarta.validation.constraints.NotNull;

public record CardMoveRequest(
        @NotNull Long listId,
        Long beforeCardId
) {
}
