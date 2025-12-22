package com.example.dentistbe.model;

import java.time.LocalDateTime;
import java.util.PriorityQueue;

public class MinEndTimeHeap {

    // javada bu kullanılıyormuş araştır
    private PriorityQueue<LocalDateTime> heap =
            new PriorityQueue<>();

    public void add(LocalDateTime endTime) {
        heap.add(endTime);
    }

    public LocalDateTime getEarliestEndTime() {
        return heap.peek();
    }

    public boolean isEmpty() {
        return heap.isEmpty();
    }
}
