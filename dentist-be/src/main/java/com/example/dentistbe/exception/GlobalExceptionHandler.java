package com.example.dentistbe.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AppointmentConflictException.class)
    public ResponseEntity<Map<String, Object>> handleAppointmentConflict(
            AppointmentConflictException ex
    ) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", ex.getMessage());
        response.put("alternatives", ex.getAlternatives());

        return ResponseEntity.badRequest().body(response);
    }
}
