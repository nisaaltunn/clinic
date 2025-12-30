package com.example.dentistbe;



import com.example.dentistbe.model.Appointment;
import com.example.dentistbe.model.Dentist;
import com.example.dentistbe.model.Patient;
import com.example.dentistbe.repository.AppointmentRepository;
import com.example.dentistbe.repository.DentistRepository;
import com.example.dentistbe.repository.PatientRepository;
import com.example.dentistbe.service.AppointmentService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AppointmentServiceTest {

    AppointmentRepository appointmentRepository = mock(AppointmentRepository.class);
    DentistRepository dentistRepository = mock(DentistRepository.class);
    PatientRepository patientRepository = mock(PatientRepository.class);

    AppointmentService service = new AppointmentService(
            appointmentRepository,
            dentistRepository,
            patientRepository
    );

    @Test
    void createAppointment_noConflict_success() {
        Patient patient = new Patient();
        patient.setId(1L);

        Dentist dentist = new Dentist();
        dentist.setId(1L);

        when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));
        when(dentistRepository.findById(1L)).thenReturn(Optional.of(dentist));
        when(appointmentRepository.findByDentistId(1L)).thenReturn(Collections.emptyList());

        LocalDateTime start = LocalDateTime.of(2025, 1, 1, 10, 0);

        Appointment saved = new Appointment();
        saved.setStartTime(start);
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(saved);

        assertDoesNotThrow(() -> {
            Appointment a = service.createAppointment(1L, 1L, start, 30);
            assertEquals(start, a.getStartTime());
        });

        verify(appointmentRepository, times(1)).save(Mockito.any());
    }
}
