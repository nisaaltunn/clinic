package com.example.dentistbe.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientDto {
    public Long id;
    public String tcNo;
    public String firstName;
   // public String lastName;
    //public LocalDate birthDate;
    //public String phone;
    //public String email;
   // public String gender;
}