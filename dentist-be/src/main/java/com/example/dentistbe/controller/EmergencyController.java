package com.example.dentistbe.controller;

import com.example.dentistbe.model.EmergencyQueue;
import com.example.dentistbe.service.EmergencyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
public class EmergencyController {

    private final EmergencyService emergencyService;

    @PostMapping("/assign/{patientId}")
    public EmergencyQueue assign(@PathVariable Long patientId){
        return emergencyService.assignEmergencyPatient(patientId);
    }



    // 🚑 Doktorun acil kuyruğunu listele
    @GetMapping("/queue/{dentistId}")
    public List<EmergencyQueue> getQueue(@PathVariable Long dentistId) {
        return emergencyService.getQueueByDentist(dentistId);
    }

    // 🚨 Sıradaki hastayı çağır (DEQUEUE)
    @DeleteMapping("/next/{dentistId}")
    public EmergencyQueue callNext(@PathVariable Long dentistId) {
        return emergencyService.callNextPatient(dentistId);
    }
}
