package com.example.trelloclone.controller;

import com.example.trelloclone.dto.CardResponse;
import com.example.trelloclone.entity.Card;
import com.example.trelloclone.service.CardService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/cards")
public class CardController {

    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping
    public List<CardResponse> getCards(@RequestParam(required = false) Long listId) {
        List<Card> cards = listId != null
                ? cardService.findByListId(listId)
                : cardService.findAll();
        return cards.stream().map(CardResponse::from).toList();
    }

    @GetMapping("/{id}")
    public CardResponse getCard(@PathVariable Long id) {
        return CardResponse.from(cardService.findById(id));
    }

    @ExceptionHandler(NoSuchElementException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleNotFound(NoSuchElementException ex) {
        return ex.getMessage();
    }
}
