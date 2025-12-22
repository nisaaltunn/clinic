package com.example.dentistbe.exception;

import java.time.LocalDateTime;
import java.util.List;

public class AppointmentConflictException extends RuntimeException {

    private final List<LocalDateTime> alternatives;

    public AppointmentConflictException(
            String message,
            List<LocalDateTime> alternatives
    ) {
        super(message);
        this.alternatives = alternatives;
    }

    public List<LocalDateTime> getAlternatives() {
        return alternatives;
    }
}
