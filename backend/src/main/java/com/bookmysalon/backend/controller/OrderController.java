package com.bookmysalon.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bookmysalon.backend.entity.Order;
import com.bookmysalon.backend.entity.Salon;
import com.bookmysalon.backend.repository.OrderRepository;
import com.bookmysalon.backend.repository.SalonRepository;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderRepository orderRepository;
    private final SalonRepository salonRepository;

    public OrderController(OrderRepository orderRepository, SalonRepository salonRepository) {
        this.orderRepository = orderRepository;
        this.salonRepository = salonRepository;
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        String customerName = (String) data.get("customerName");
        String mobile = (String) data.get("mobile");
        String serviceName = (String) data.get("serviceName");
        String timeSlot = (String) data.get("timeSlot");

        Map<String, Object> salonMap = (Map<String, Object>) data.get("salon");
        Integer salonId = (Integer) salonMap.get("id");

        Optional<Salon> salonOptional = salonRepository.findById(Long.valueOf(salonId));

        if (salonOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Salon not found");
        }

        Order order = new Order();
        order.setCustomerName(customerName);
        order.setMobile(mobile);
        order.setServiceName(serviceName);
        order.setTimeSlot(timeSlot);
        order.setSalon(salonOptional.get());
        order.setStatus("PENDING");

        return ResponseEntity.ok(orderRepository.save(order));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        Optional<Order> orderOptional = orderRepository.findById(id);

        if (orderOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Order not found");
        }

        Order order = orderOptional.get();
        order.setStatus(status);
        return ResponseEntity.ok(orderRepository.save(order));
    }
}
