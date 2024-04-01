package org.zjuse.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.zjuse.entity.Discount;

import jakarta.persistence.LockModeType;

public interface DiscountRepository extends JpaRepository<Discount, Long>, JpaSpecificationExecutor<Discount> {

    @Override
    @Lock(value = LockModeType.PESSIMISTIC_WRITE)
    Optional<Discount> findById(Long id);
    
}