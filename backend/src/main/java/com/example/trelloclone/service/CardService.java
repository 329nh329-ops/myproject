package com.example.trelloclone.service;

import com.example.trelloclone.entity.Card;
import com.example.trelloclone.repository.CardRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CardService {

    private final CardRepository cardRepository;

    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    public List<Card> findAll() {
        return cardRepository.findAll();
    }

    public List<Card> findByListId(Long listId) {
        return cardRepository.findByTaskListId(listId);
    }

    public Card findById(Long id) {
        return cardRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Card not found: id=" + id));
    }
}
