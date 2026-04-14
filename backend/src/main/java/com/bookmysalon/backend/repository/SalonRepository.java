package com.bookmysalon.backend.repository;

import com.bookmysalon.backend.entity.Salon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalonRepository extends JpaRepository<Salon, Long> {
}
