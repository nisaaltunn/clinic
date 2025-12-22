package com.example.dentistbe.model.dto;

import java.time.LocalDateTime;

public record AppointmentRequest(
        Long patientId,
        Long dentistId,
        LocalDateTime startTime,
        int durationMinutes
) {}
