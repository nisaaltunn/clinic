package com.example.dentistbe.model.dto;

import com.example.dentistbe.model.Appointment;

import java.time.LocalDateTime;
import java.util.List;

public class AppointmentResult {

    public boolean confirmed;
    public Appointment appointment;
    public List<LocalDateTime> alternatives;
    public boolean waiting;

    private AppointmentResult(
            boolean confirmed,
            Appointment appointment,
            List<LocalDateTime> alternatives,
            boolean waiting
    ) {
        this.confirmed = confirmed;
        this.appointment = appointment;
        this.alternatives = alternatives;
        this.waiting = waiting;
    }

    // ✅ Randevu alındı
    public static AppointmentResult confirmed(Appointment appointment) {
        return new AppointmentResult(
                true,
                appointment,
                null,
                false
        );
    }

    // 🔁 Alternatif saatler var
    public static AppointmentResult alternatives(List<LocalDateTime> alternatives) {
        return new AppointmentResult(
                false,
                null,
                alternatives,
                false
        );
    }

    // ⏳ Kuyruğa alındı
    public static AppointmentResult waiting() {
        return new AppointmentResult(
                false,
                null,
                null,
                true
        );
    }
}
