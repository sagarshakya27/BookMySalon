package com.bookmysalon.backend.repository;

import com.bookmysalon.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
