package com.example.dentistbe.controller;



import com.example.dentistbe.model.dto.DentistDto;
import com.example.dentistbe.model.dto.DentistRequestDto;
import com.example.dentistbe.service.DentistService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dentists")
@RequiredArgsConstructor
public class DentistController {

    private final DentistService dentistService;

    @PostMapping
    public DentistDto create(@RequestBody DentistRequestDto request) {
        return dentistService.createDentist(request);
    }

    @GetMapping
    public List<DentistDto> getAll() {
        return dentistService.getAllDentists();
    }

    @DeleteMapping("/all") // örnek URL: /api/dentists/all
    public void deleteAll() {
        dentistService.deleteAllDentists();
    }
    @GetMapping("/specialty/{specialty}")
    public List<DentistDto> getBySpecialty(@PathVariable String specialty) {
        return dentistService.getDentistsBySpecialty(specialty);
    }

}
