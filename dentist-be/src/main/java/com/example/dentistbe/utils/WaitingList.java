package com.example.dentistbe.utils;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.Queue;

public class WaitingList {

    public static class WaitingPatient {
        public Long patientId;
        public Long dentistId;
        public LocalDateTime requestedStart;
        public int duration;

        public WaitingPatient(Long patientId, Long dentistId,
                              LocalDateTime requestedStart, int duration) {
            this.patientId = patientId;
            this.dentistId = dentistId;
            this.requestedStart = requestedStart;
            this.duration = duration;
        }
    }

    private final Queue<WaitingPatient> queue = new LinkedList<>();

    public void add(Long patientId, Long dentistId,
                    LocalDateTime requestedStart, int duration) {
        queue.add(new WaitingPatient(patientId, dentistId, requestedStart, duration));
    }

    public WaitingPatient poll() {
        return queue.poll();
    }

    public boolean isEmpty() {
        return queue.isEmpty();
    }
}
