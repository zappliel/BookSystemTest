package org.zjuse.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.io.Serializable;
import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item,Integer>, JpaSpecificationExecutor<Item>, Serializable {
    List<Item> findByNameLike(String name);
    List<Item> findById(int i);
    List<Item> findByName(String name);
    void deleteById(int id);
    List<Item> findBySellerId(int id);
    @Query("SELECT u FROM Item u WHERE u.sellerId = :id AND u.name LIKE %:name%")
    List<Item> findByIdAndNameLike(@Param("id") int id, @Param("name") String name);
}
