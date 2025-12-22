package com.example.dentistbe.controller;

import com.example.dentistbe.model.Appointment;
import com.example.dentistbe.model.Dentist;

import com.example.dentistbe.model.dto.AppointmentRequest;
import com.example.dentistbe.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public Appointment createAppointment(
            @RequestBody AppointmentRequest request
    ) {
        return appointmentService.createAppointment(
                request.patientId(),
                request.dentistId(),
                request.startTime(),
                request.durationMinutes()
        );
    }

    @GetMapping("/dentists")
    public List<Dentist> getDentistsBySpecialty(
            @RequestParam String specialty
    ) {
        return appointmentService.getDentistsBySpecialty(specialty);
    }
}
