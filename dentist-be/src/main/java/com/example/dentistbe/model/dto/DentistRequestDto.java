package com.example.dentistbe.model.dto;
//frontendden gelen veriyi karşılar


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DentistRequestDto {
    private String fullName;
    private String email;
    private String title;
    private List<String> specialty;


}