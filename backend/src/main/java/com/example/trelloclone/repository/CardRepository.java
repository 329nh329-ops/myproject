package com.example.trelloclone.repository;

import com.example.trelloclone.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, Long> {

    List<Card> findByTaskListId(Long listId);

    @Query("SELECT MAX(c.displayOrder) FROM Card c WHERE c.taskList.id = :listId")
    Optional<Integer> findMaxDisplayOrderByTaskListId(Long listId);
}
