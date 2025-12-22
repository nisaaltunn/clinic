package com.example.dentistbe.utils;

import java.time.LocalDateTime;
import java.util.PriorityQueue;

public class MinEndTimeHeap {

    private PriorityQueue<LocalDateTime> heap = new PriorityQueue<>();

    public void add(LocalDateTime endTime) {
        heap.add(endTime);
    }

    public LocalDateTime poll() {
        return heap.poll();
    }

    public boolean isEmpty() {
        return heap.isEmpty();
    }
}
