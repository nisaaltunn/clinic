package com.example.dentistbe.repository;

import com.example.dentistbe.model.EmergencyQueue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyQueueRepository extends JpaRepository<EmergencyQueue, Long> {
    // Acil doktoruna göre kuyruğu getir
    List<EmergencyQueue> findByDentistId(Long dentistId);

    List<EmergencyQueue> findByDentistIdOrderByArrivalTimeAsc(Long dentistId);

    EmergencyQueue findFirstByDentistIdOrderByArrivalTimeAsc(Long dentistId);

    void delete(EmergencyQueue queue);

   int countByDentistId(Long dentistId); // Kuyruk uzunluğu
}
