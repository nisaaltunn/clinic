package com.example.dentistbe.model;



import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
@Data
@Table(name = "appointment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Patient patient;

    @ManyToOne
    private Dentist dentist;

    private LocalDateTime appointmentTime;
    private String description;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

}
