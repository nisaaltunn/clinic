package com.example.dentistbe.service;
import com.example.dentistbe.model.Appointment;
import com.example.dentistbe.repository.AppointmentRepository;
import com.example.dentistbe.repository.DentistRepository;
import com.example.dentistbe.model.Dentist;
import com.example.dentistbe.mapper.DentistMapper;
import com.example.dentistbe.model.dto.DentistDto;
import com.example.dentistbe.model.dto.DentistRequestDto;
import com.example.dentistbe.utils.QuickSortAppointment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DentistService {

    private final DentistRepository dentistRepository;
    private final AppointmentRepository appointmentRepository;

    public DentistDto getDentistById(Long id) {

        Dentist dentist = dentistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doktor bulunamadı"));

        return DentistDto.builder()
                .id(dentist.getId())
                .fullName(dentist.getFullName())
                .build();
    }
    public DentistDto createDentist(DentistRequestDto request) {
        if (dentistRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already taken!");
        }

        Dentist dentist = DentistMapper.toEntity(request);
        Dentist saved = dentistRepository.save(dentist);

        return DentistMapper.toDTO(saved);
    }

    public List<DentistDto> getAllDentists() {
        return dentistRepository.findAll()
                .stream()
                .map(DentistMapper::toDTO)
                .toList();
    }

    public void deleteAllDentists() {
        dentistRepository.deleteAll(); // tüm dentist kayıtlarını siler, tablolar kalır
    }
    public Dentist getById(Long id) {
        return dentistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dentist not found"));
    }
    public List<DentistDto> getDentistsBySpecialty(String specialty) {
        return dentistRepository.findBySpecialty(specialty)
                .stream()
                .map(DentistMapper::toDTO)
                .toList();
    }


    public List<Appointment> getSortedAppointmentsByDentist(Long dentistId) {

        List<Appointment> appointments =
                appointmentRepository.findByDentistId(dentistId);

        if (appointments.isEmpty()) {
            return appointments;
        }

        QuickSortAppointment.sortByStartTime(appointments);

        return appointments;
    }


}
