package com.example.dentistbe.service;




import com.example.dentistbe.mapper.PatientMapper;
import com.example.dentistbe.model.Patient;
import com.example.dentistbe.model.dto.PatientDto;
import com.example.dentistbe.repository.PatientRepository;
import com.example.dentistbe.utils.BinarySearchPatient;
import com.example.dentistbe.utils.MergeSortPatient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientDto addPatient(PatientDto dto) {

        // TC kontrolü (önemli)
        patientRepository.findByTcNo(dto.tcNo)
                .ifPresent(p -> {
                    throw new RuntimeException("Bu TC ile hasta zaten kayıtlı");
                });

        Patient patient = PatientMapper.toEntity(dto);
        Patient saved = patientRepository.save(patient);

        return PatientMapper.toDto(saved);
    }

    public Patient findPatientByTcBinary(String tc) {

        List<Patient> patients = patientRepository.findAll();

        MergeSortPatient.sortByTc(patients);

        Patient patient = BinarySearchPatient.searchByTc(patients, tc);

        if (patient == null) {
            throw new RuntimeException("Hasta bulunamadı");
        }

        return patient;
    }


    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hasta bulunamadı"));
    }

    public boolean deleteById(Long id) {
        if (!patientRepository.existsById(id)) return false;
        patientRepository.deleteById(id);
        return true;
    }
}
