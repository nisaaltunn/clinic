package com.example.dentistbe.model;

import com.example.dentistbe.utils.IntervalTree;

import java.time.LocalDateTime;

public class DentistSchedule {

    private final IntervalTree intervalTree = new IntervalTree();

    public boolean isAvailable(LocalDateTime start, LocalDateTime end) {
        return !intervalTree.hasOverlap(start, end);
    }

    public void addAppointment(LocalDateTime start, LocalDateTime end) {
        intervalTree.insert(start, end);
    }
}
