package com.example.dentistbe.repository;


import com.example.dentistbe.model.Dentist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DentistRepository extends JpaRepository<Dentist, Long> {
    boolean existsByEmail(String email);

    @Query("SELECT d FROM Dentist d JOIN d.specialty s WHERE s = :specialty")
    List<Dentist> findBySpecialty(@Param("specialty") String specialty);

    @Query("SELECT d FROM Dentist d JOIN d.specialty s WHERE s = 'acil'")
    List<Dentist> findEmergencyDentists();

}
