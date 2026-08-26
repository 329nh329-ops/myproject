package com.example.trelloclone.service;

import com.example.trelloclone.dto.CardCreateRequest;
import com.example.trelloclone.entity.Card;
import com.example.trelloclone.entity.TaskList;
import com.example.trelloclone.repository.CardRepository;
import com.example.trelloclone.repository.TaskListRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CardService {

    private final CardRepository cardRepository;
    private final TaskListRepository taskListRepository;

    public CardService(CardRepository cardRepository, TaskListRepository taskListRepository) {
        this.cardRepository = cardRepository;
        this.taskListRepository = taskListRepository;
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

    public Card create(CardCreateRequest request) {
        TaskList taskList = taskListRepository.findById(request.listId())
                .orElseThrow(() -> new NoSuchElementException("List not found: id=" + request.listId()));

        int nextDisplayOrder = cardRepository.findByTaskListId(request.listId()).stream()
                .map(Card::getDisplayOrder)
                .max(Comparator.naturalOrder())
                .map(order -> order + 1)
                .orElse(0);

        Card card = new Card();
        card.setTaskList(taskList);
        card.setTitle(request.title());
        card.setDescription(request.description());
        card.setPriority(request.priority());
        card.setDueDate(request.dueDate());
        card.setDisplayOrder(nextDisplayOrder);

        return cardRepository.save(card);
    }
}
