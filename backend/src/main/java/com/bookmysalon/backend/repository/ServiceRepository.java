package com.bookmysalon.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

// ✅ Apni entity ka Service import karo, NOT java.security
import com.bookmysalon.backend.entity.Service;

public interface ServiceRepository extends JpaRepository<Service, Long> {}