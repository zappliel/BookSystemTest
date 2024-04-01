package org.zjuse.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.io.Serializable;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<Orders,Integer> , JpaSpecificationExecutor<Orders>, Serializable {
    List<Orders> findByProductId(int productId);
    Orders findByOrderId(int id);
    List<Orders> findByProductNameLike(String name);

}
