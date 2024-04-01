package org.zjuse.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.zjuse.entity.Hotel;

import jakarta.persistence.LockModeType;

public interface HotelRepository extends JpaRepository<Hotel, Long>, JpaSpecificationExecutor<Hotel> {

    @Override
    @Lock(value = LockModeType.PESSIMISTIC_WRITE)
    Optional<Hotel> findById(Long id);
    
}
