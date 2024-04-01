package org.zjuse.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.zjuse.entity.Flight;

import jakarta.persistence.LockModeType;

public interface FlightRepository extends JpaRepository<Flight, Long>, JpaSpecificationExecutor<Flight> {

    @Override
    @Lock(value = LockModeType.PESSIMISTIC_WRITE)
    Optional<Flight> findById(Long id);
    
}
