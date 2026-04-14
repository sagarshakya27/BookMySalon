package com.bookmysalon.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookmysalon.backend.entity.Salon;
import com.bookmysalon.backend.repository.SalonRepository;

@RestController
	@RequestMapping("/api/salons")
	@CrossOrigin(origins = "*")
	public class SalonController {

	    private final SalonRepository salonRepository;

	    public SalonController(SalonRepository salonRepository) {
	        this.salonRepository = salonRepository;
	    }

	    @PostMapping
	    public ResponseEntity<Salon> createSalon(@RequestBody Salon salon) {
	        return ResponseEntity.ok(salonRepository.save(salon));
	    }

	    @GetMapping
	    public ResponseEntity<List<Salon>> getAllSalons() {
	        return ResponseEntity.ok(salonRepository.findAll());
	    }
	}


