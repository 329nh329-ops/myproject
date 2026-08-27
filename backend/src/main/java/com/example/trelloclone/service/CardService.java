package com.example.trelloclone.service;

import com.example.trelloclone.dto.CardCreateRequest;
import com.example.trelloclone.dto.CardMoveRequest;
import com.example.trelloclone.dto.CardSortRequest;
import com.example.trelloclone.dto.CardUpdateRequest;
import com.example.trelloclone.entity.Card;
import com.example.trelloclone.entity.TaskList;
import com.example.trelloclone.repository.CardRepository;
import com.example.trelloclone.repository.TaskListRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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

        int nextDisplayOrder = cardRepository.findMaxDisplayOrderByTaskListId(request.listId())
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

    public Card update(Long id, CardUpdateRequest request) {
        Card card = findById(id);
        card.setTitle(request.title());
        card.setDescription(request.description());
        card.setPriority(request.priority());
        card.setDueDate(request.dueDate());
        return cardRepository.save(card);
    }

    @Transactional
    public List<Card> move(Long id, CardMoveRequest request) {
        Card movingCard = findById(id);
        TaskList targetList = taskListRepository.findById(request.listId())
                .orElseThrow(() -> new NoSuchElementException("List not found: id=" + request.listId()));

        List<Card> targetListCards = new ArrayList<>(cardRepository.findByTaskListId(request.listId()));
        targetListCards.removeIf(c -> c.getId().equals(movingCard.getId()));
        targetListCards.sort(Comparator.comparing(Card::getDisplayOrder));

        int insertAt = targetListCards.size();
        if (request.beforeCardId() != null) {
            for (int i = 0; i < targetListCards.size(); i++) {
                if (targetListCards.get(i).getId().equals(request.beforeCardId())) {
                    insertAt = i;
                    break;
                }
            }
        }
        targetListCards.add(insertAt, movingCard);

        movingCard.setTaskList(targetList);
        for (int i = 0; i < targetListCards.size(); i++) {
            targetListCards.get(i).setDisplayOrder(i);
        }

        return cardRepository.saveAll(targetListCards);
    }

    @Transactional
    public void delete(Long id) {
        Card card = findById(id);
        Long listId = card.getTaskList().getId();

        cardRepository.delete(card);

        List<Card> remainingCards = new ArrayList<>(cardRepository.findByTaskListId(listId));
        remainingCards.sort(Comparator.comparing(Card::getDisplayOrder));
        for (int i = 0; i < remainingCards.size(); i++) {
            remainingCards.get(i).setDisplayOrder(i);
        }
        cardRepository.saveAll(remainingCards);
    }

    @Transactional
    public List<Card> sort(Long listId, CardSortRequest request) {
        taskListRepository.findById(listId)
                .orElseThrow(() -> new NoSuchElementException("List not found: id=" + listId));

        List<Card> cards = new ArrayList<>(cardRepository.findByTaskListId(listId));

        if ("priority".equals(request.sortBy())) {
            cards.sort(Comparator.comparing(card -> card.getPriority().ordinal()));
        } else {
            cards.sort(Comparator.comparing(Card::getDueDate, Comparator.nullsLast(Comparator.naturalOrder())));
        }

        for (int i = 0; i < cards.size(); i++) {
            cards.get(i).setDisplayOrder(i);
        }

        return cardRepository.saveAll(cards);
    }
}
