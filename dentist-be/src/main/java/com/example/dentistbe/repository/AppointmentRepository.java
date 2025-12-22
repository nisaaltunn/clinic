package com.example.dentistbe.repository;

import com.example.dentistbe.model.Appointment;
import com.example.dentistbe.model.Dentist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByDentist(Dentist dentist);
    List<Appointment> findByDentistId(Long dentistId);
}
