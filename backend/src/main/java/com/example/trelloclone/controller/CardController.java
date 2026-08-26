package com.example.trelloclone.controller;

import com.example.trelloclone.dto.CardCreateRequest;
import com.example.trelloclone.dto.CardMoveRequest;
import com.example.trelloclone.dto.CardResponse;
import com.example.trelloclone.dto.CardSortRequest;
import com.example.trelloclone.dto.CardUpdateRequest;
import com.example.trelloclone.entity.Card;
import com.example.trelloclone.service.CardService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
public class CardController {

    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping("/api/cards")
    public List<CardResponse> getCards(@RequestParam(required = false) Long listId) {
        List<Card> cards = listId != null
                ? cardService.findByListId(listId)
                : cardService.findAll();
        return cards.stream().map(CardResponse::from).toList();
    }

    @GetMapping("/api/cards/{id}")
    public CardResponse getCard(@PathVariable Long id) {
        return CardResponse.from(cardService.findById(id));
    }

    @PostMapping("/api/cards")
    @ResponseStatus(HttpStatus.CREATED)
    public CardResponse createCard(@RequestBody @Valid CardCreateRequest request) {
        return CardResponse.from(cardService.create(request));
    }

    @PutMapping("/api/cards/{id}")
    public CardResponse updateCard(@PathVariable Long id, @RequestBody @Valid CardUpdateRequest request) {
        return CardResponse.from(cardService.update(id, request));
    }

    @PatchMapping("/api/cards/{id}/move")
    public List<CardResponse> moveCard(@PathVariable Long id, @RequestBody @Valid CardMoveRequest request) {
        return cardService.move(id, request).stream().map(CardResponse::from).toList();
    }

    @PatchMapping("/api/lists/{listId}/cards/sort")
    public List<CardResponse> sortCards(@PathVariable Long listId, @RequestBody @Valid CardSortRequest request) {
        return cardService.sort(listId, request).stream().map(CardResponse::from).toList();
    }

    @DeleteMapping("/api/cards/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCard(@PathVariable Long id) {
        cardService.delete(id);
    }

    @ExceptionHandler(NoSuchElementException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleNotFound(NoSuchElementException ex) {
        return ex.getMessage();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationError(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .reduce((a, b) -> a + ", " + b)
                .orElse("入力内容が不正です");
        return ResponseEntity.badRequest().body(message);
    }
}
