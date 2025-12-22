package com.example.dentistbe.controller;


import com.example.dentistbe.model.Patient;
import com.example.dentistbe.model.dto.PatientDto;
import com.example.dentistbe.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/patient")
public class PatientController {

    private final PatientService patientService;

    @PostMapping("/add")
    public PatientDto addPatient(@RequestBody PatientDto dto) {
        return patientService.addPatient(dto);
    }

    @GetMapping("/all")
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    @GetMapping("/{id}")
    public Patient getPatient(@PathVariable Long id) {
        return patientService.getById(id);
    }
    @GetMapping("/tc/{tcNo}")
    public Patient getPatientByTc(@PathVariable String tcNo) {
        return patientService.findPatientByTcBinary(tcNo);
    }

    @DeleteMapping("/{id}")
    public String deletePatient(@PathVariable Long id) {
        boolean result = patientService.deleteById(id);
        return result ? "Deleted" : "Not Found";
    }
}
