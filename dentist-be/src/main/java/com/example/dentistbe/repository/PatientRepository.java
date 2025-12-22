package com.example.dentistbe.repository;




import com.example.dentistbe.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByTcNo(String tcNo);

}
