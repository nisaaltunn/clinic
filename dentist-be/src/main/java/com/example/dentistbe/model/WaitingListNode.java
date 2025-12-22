package com.example.dentistbe.model;

import java.time.LocalDateTime;

public class WaitingListNode {

    private Long patientId;
    private LocalDateTime requestedTime;
    private WaitingListNode next;

    public WaitingListNode(Long patientId, LocalDateTime requestedTime) {
        this.patientId = patientId;
        this.requestedTime = requestedTime;
        this.next = null;
    }

    public Long getPatientId() {
        return patientId;
    }

    public LocalDateTime getRequestedTime() {
        return requestedTime;
    }

    public WaitingListNode getNext() {
        return next;
    }

    public void setNext(WaitingListNode next) {
        this.next = next;
    }
}
