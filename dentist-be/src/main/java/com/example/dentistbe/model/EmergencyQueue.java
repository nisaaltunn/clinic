package com.example.dentistbe.model;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "emergency_queue")
public class EmergencyQueue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long patientId;     // acile gelen hasta
    private Long dentistId;     // acil doktor seçimi
    private LocalDateTime arrivalTime; // hasta geliş zamanı

}
