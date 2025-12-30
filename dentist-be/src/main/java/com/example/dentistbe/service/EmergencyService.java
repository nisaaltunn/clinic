package com.example.dentistbe.service;

import com.example.dentistbe.model.EmergencyQueue;
import com.example.dentistbe.model.Dentist;
import com.example.dentistbe.repository.EmergencyQueueRepository;
import com.example.dentistbe.repository.DentistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class EmergencyService {

    private final EmergencyQueueRepository emergencyQueueRepository;
    private final DentistRepository dentistRepository;

    public EmergencyQueue assignEmergencyPatient(Long patientId) {

        List<Dentist> emergencyDentists = dentistRepository.findBySpecialty("acil");

        if (emergencyDentists.isEmpty()) {
            throw new RuntimeException("Acil doktor bulunamadı ⚠️");
        }

        // 🗺️ Dijkstra için başlangıç değerleri
        Map<Long, Integer> distance = new HashMap<>();
        Map<Long, Boolean> visited = new HashMap<>();

        for (Dentist d : emergencyDentists) {
            int queueSize = emergencyQueueRepository.countByDentistId(d.getId());
            distance.put(d.getId(), queueSize);
            visited.put(d.getId(), false);
        }

        // 🔽 Öncelikli kuyruğumuz (min-heap)
        PriorityQueue<Long> pq = new PriorityQueue<>(
                Comparator.comparingInt(distance::get)
        );

        pq.addAll(distance.keySet());

        // 🚀 Dijkstra
        while (!pq.isEmpty()) {
            Long current = pq.poll();

            if (visited.get(current)) continue;
            visited.put(current, true);

            for (Dentist d : emergencyDentists) {
                if (!visited.get(d.getId())) {

                    int newDist = distance.get(current)
                            + emergencyQueueRepository.countByDentistId(d.getId());

                    if (newDist < distance.get(d.getId())) {
                        distance.put(d.getId(), newDist);
                        pq.add(d.getId());
                    }
                }
            }
        }

        // 🎯 En iyi doktor (min path)
        Long bestDentistId = distance.entrySet().stream()
                .min(Map.Entry.comparingByValue())
                .get()
                .getKey();

        EmergencyQueue saved = EmergencyQueue.builder()
                .patientId(patientId)
                .dentistId(bestDentistId)
                .arrivalTime(LocalDateTime.now())
                .build();

        return emergencyQueueRepository.save(saved);
    }



    // 📌 Doktorun sırasındaki hastaları listele
    public List<EmergencyQueue> getQueueByDentist(Long dentistId) {
        return emergencyQueueRepository.findByDentistIdOrderByArrivalTimeAsc(dentistId);
    }

    // 📌 Doktor sıradaki hastayı çağırsın (Dequeue)
    public EmergencyQueue callNextPatient(Long dentistId) {
        EmergencyQueue next = emergencyQueueRepository
                .findFirstByDentistIdOrderByArrivalTimeAsc(dentistId);

        if (next == null) {
            throw new RuntimeException("Bu doktor için bekleyen hasta yok 🙅");
        }

        emergencyQueueRepository.delete(next);

        return next;
    }
}
