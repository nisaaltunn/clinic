package com.example.dentistbe.mapper;

import com.example.dentistbe.model.Patient;
import com.example.dentistbe.model.dto.PatientDto;

public class PatientMapper {

    public static Patient toEntity(PatientDto dto) {
        Patient p = new Patient();
        p.setId(dto.id);
        p.setTcNo(dto.tcNo);
        p.setFirstName(dto.firstName);

        return p;
    }

    public static PatientDto toDto(Patient patient) {
        PatientDto dto = new PatientDto();
        dto.id = patient.getId();
        dto.tcNo = patient.getTcNo();
        dto.firstName = patient.getFirstName();

        return dto;
    }
}
