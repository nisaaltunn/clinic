package com.example.dentistbe.mapper;

import com.example.dentistbe.model.Dentist;
import com.example.dentistbe.model.dto.DentistDto;
import com.example.dentistbe.model.dto.DentistRequestDto;

public class DentistMapper {

    public static Dentist toEntity(DentistRequestDto dto) {
        return Dentist.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .title(dto.getTitle())
                .specialty(dto.getSpecialty()) // artık String
                .build();
    }

    public static DentistDto toDTO(Dentist d) {
        return DentistDto.builder()
                .id(d.getId())
                .fullName(d.getFullName())
                .email(d.getEmail())
                .title(d.getTitle())
                .specialty(d.getSpecialty()) // artık String
                .build();
    }


}
