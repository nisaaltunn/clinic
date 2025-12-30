package com.example.dentistbe.service;

import com.example.dentistbe.model.Appointment;
import com.example.dentistbe.model.Dentist;
import com.example.dentistbe.model.Patient;
import com.example.dentistbe.repository.AppointmentRepository;
import com.example.dentistbe.repository.DentistRepository;
import com.example.dentistbe.repository.PatientRepository;
import com.example.dentistbe.utils.IntervalTree;
import com.example.dentistbe.utils.MinEndTimeHeap;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.dentistbe.utils.QuickSortAppointment;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DentistRepository dentistRepository;
    private final PatientRepository patientRepository;

    public Appointment createAppointment(
            Long patientId,
            Long dentistId,
            LocalDateTime startTime,
            int durationMinutes
    ) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Hasta bulunamadı"));
        Dentist dentist = dentistRepository.findById(dentistId)
                .orElseThrow(() -> new RuntimeException("Doktor bulunamadı"));

        LocalDateTime endTime = startTime.plusMinutes(durationMinutes);

        // Doktorun mevcut randevularını al
        List<Appointment> existingAppointments =
                appointmentRepository.findByDentistId(dentistId);

        // Interval Tree + Min-Heap
        IntervalTree intervalTree = new IntervalTree();
        MinEndTimeHeap minHeap = new MinEndTimeHeap();

        for (Appointment a : existingAppointments) {
            intervalTree.insert(a.getStartTime(), a.getEndTime());
            minHeap.add(a.getEndTime());
        }

        // ❌ ÇAKIŞMA VARSA → Alternatif saat öner
        if (intervalTree.hasOverlap(startTime, endTime)) {

            List<LocalDateTime> alternatives =
                    generateAlternativeSlots(
                            intervalTree,
                            minHeap,
                            durationMinutes,
                            3,
                            startTime
                    );

            throw new RuntimeException("Bu saat dolu. Alternatifler: " + alternatives);
        }

        // ✔️ ÇAKIŞMA YOK → RANDEVU KAYDET
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDentist(dentist);
        appointment.setStartTime(startTime);
        appointment.setEndTime(endTime);

        return appointmentRepository.save(appointment);
    }

    // Alternatif saat üret
    private List<LocalDateTime> generateAlternativeSlots(
            IntervalTree tree,
            MinEndTimeHeap heap,
            int durationMinutes,
            int limit,
            LocalDateTime requestedStart
    ) {
        List<LocalDateTime> alternatives = new ArrayList<>();

        LocalDateTime workStart = requestedStart.toLocalDate().atTime(9, 0);
        LocalDateTime workEnd = requestedStart.toLocalDate().atTime(18, 0);

        while (!heap.isEmpty() && alternatives.size() < limit) {

            LocalDateTime candidateStart = heap.poll();

            if (!candidateStart.toLocalDate().equals(requestedStart.toLocalDate())) continue;
            if (candidateStart.isBefore(workStart) ||
                    candidateStart.plusMinutes(durationMinutes).isAfter(workEnd)) continue;

            LocalDateTime candidateEnd = candidateStart.plusMinutes(durationMinutes);

            if (!tree.hasOverlap(candidateStart, candidateEnd)) {
                alternatives.add(candidateStart);
            }
        }

        return alternatives;
    }

    // Doktorun randevularını sıralı döndür
    public List<Appointment> getAppointmentsByDentistSorted(Long dentistId) {
        List<Appointment> appointments = appointmentRepository.findByDentistId(dentistId);
        if (appointments != null && appointments.size() > 1) {
            QuickSortAppointment.sortByStartTime(appointments);
        }
        return appointments;
    }
    public List<Dentist> getDentistsBySpecialty(String specialty) {
        return dentistRepository.findBySpecialty(specialty);
    }
}

