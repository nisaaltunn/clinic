package com.example.dentistbe.service;
import com.example.dentistbe.repository.DentistRepository;
import com.example.dentistbe.model.Dentist;
import com.example.dentistbe.mapper.DentistMapper;
import com.example.dentistbe.model.dto.DentistDto;
import com.example.dentistbe.model.dto.DentistRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DentistService {

    private final DentistRepository dentistRepository;

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

}
