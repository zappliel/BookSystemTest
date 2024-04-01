package org.zjuse.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.zjuse.entity.Comment;

import jakarta.persistence.LockModeType;

public interface CommentRepository extends JpaRepository<Comment, Long>, JpaSpecificationExecutor<Comment> {

    @Override
    @Lock(value = LockModeType.PESSIMISTIC_WRITE)
    Optional<Comment> findById(Long id);
    
}
