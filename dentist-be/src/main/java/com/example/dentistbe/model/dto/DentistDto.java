package com.example.dentistbe.model.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DentistDto {
    private Long id;
    private String fullName;
    private String email;
    private String title;
    private List<String> specialty;

}