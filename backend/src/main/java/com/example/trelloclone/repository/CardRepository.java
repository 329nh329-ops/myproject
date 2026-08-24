package com.example.trelloclone.repository;

import com.example.trelloclone.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepository extends JpaRepository<Card, Long> {
}
