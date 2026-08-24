package com.example.trelloclone.repository;

import com.example.trelloclone.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {

    List<Card> findByTaskListId(Long listId);
}
