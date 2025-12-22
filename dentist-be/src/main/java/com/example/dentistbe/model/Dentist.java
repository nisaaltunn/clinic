package com.example.dentistbe.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "dentists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dentist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    // Hekimin çalıştığı bölümler (ortodonti, pedodonti vs.)
    private String title;

    @ElementCollection
    private List<String> specialty;

    @Transient
    private DentistSchedule schedule = new DentistSchedule();
}