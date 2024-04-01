package org.zjuse.management;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zjuse.entity.HotelOrder;
import org.zjuse.entity.Order;
import org.zjuse.entity.Order.Status;
import org.zjuse.entity.Order.Type;
import org.zjuse.entity.Room;
import org.zjuse.repository.HotelRepository;
import org.zjuse.repository.RoomRepository;
import org.zjuse.utils.ApiResult;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional(rollbackFor = Exception.class, timeout = 300)
public class RoomManagementImpl implements RoomManagement {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private OrderManagement orderManagement;

    @Autowired
    private HotelRepository hotelRepository;

    @Override
    public ApiResult queryRoom(Long hotelId, String roomClass, Double minPrice, Double maxPrice) {
        try {
            Specification<Room> specification = new Specification<Room>() {
                @Override
                public Predicate toPredicate(Root<Room> root, CriteriaQuery<?> query,
                        CriteriaBuilder criteriaBuilder) {
                    List<Predicate> predicates = new ArrayList<>();
                    if (hotelId != null) {
                        predicates.add(criteriaBuilder.equal(root.get("hotel").get("id"), hotelId));
                    }
                    if (roomClass != null) {
                        predicates.add(criteriaBuilder.equal(root.get("room_class"), roomClass));
                    }
                    if (minPrice != null) {
                        predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
                    }
                    if (maxPrice != null) {
                        predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
                    }
                    return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
                }
            };
            List<Room> rooms = roomRepository.findAll(specification, Sort.by(Direction.ASC, "id"));
            return new ApiResult(true, rooms);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult addRoom(Room room) {
        try {
            room = roomRepository.save(room);
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult updateRoom(Room room) {
        try {
            room = roomRepository.save(room);
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult deleteRoom(Long id) {
        try {
            // check if there is any order related to this room which is not finished
            Room room = roomRepository.findById(id).orElse(null);
            if (room == null) {
                throw new Exception("Room not found.");
            }
            ApiResult unpaid = orderManagement.queryOrder(null, null, room.getHotel().getId(), Status.UNPAID,
                    Type.HOTEL);
            ApiResult paid = orderManagement.queryOrder(null, null, room.getHotel().getId(), Status.PAID, Type.HOTEL);
            if (!unpaid.ok || !paid.ok) {
                throw new Exception("Failed to query orders related to this room.");
            }
            List<Order> orders = (List<Order>) unpaid.payload;
            orders.addAll((List<Order>) paid.payload);
            for (Order order : orders) {
                HotelOrder hotelOrder = new HotelOrder(order);
                if (hotelOrder.getRoom_id() == id) {
                    throw new Exception("There are orders related to this room which is not finished.");
                }
            }
            // delete orders related to this room
            ApiResult order = orderManagement.queryOrder(null, null, room.getHotel().getId(), null, Type.HOTEL);
            if (!order.ok) {
                throw new Exception("Failed to query orders related to this room.");
            }
            orders = (List<Order>) order.payload;
            Boolean flag = false;
            for (Order o : orders) {
                HotelOrder hotelOrder = new HotelOrder(o);
                if (hotelOrder.getRoom_id() == id) {
                    flag = true;
                    orderManagement.deleteOrder(o.getId());
                }
            }
            if (flag) {
                log.info("There are orders related to this room, tring to delete them.");
            }

            roomRepository.deleteById(id);
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult resetRoom() {
        try {
            orderManagement.resetOrder();
            roomRepository.deleteAll();
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }
}
