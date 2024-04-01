package org.zjuse.management;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zjuse.entity.Flight;
import org.zjuse.entity.FlightOrder;
import org.zjuse.entity.HotelOrder;
import org.zjuse.entity.Order;
import org.zjuse.entity.Order.Status;
import org.zjuse.entity.Order.Type;
import org.zjuse.entity.Room;
import org.zjuse.repository.FlightRepository;
import org.zjuse.repository.HotelRepository;
import org.zjuse.repository.OrderRepository;
import org.zjuse.repository.RoomRepository;
import org.zjuse.utils.ApiResult;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Service
@Transactional(rollbackFor = Exception.class, timeout = 300)
public class OrderManagementImpl implements OrderManagement {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Override
    public ApiResult queryOrder(Long id, Long customerId, Long serviceId, Status status, Type type) {
        try {
            Specification<Order> specification = new Specification<Order>() {
                @Override
                public Predicate toPredicate(Root<Order> root, CriteriaQuery<?> query,
                        CriteriaBuilder criteriaBuilder) {
                    List<Predicate> predicates = new ArrayList<>();
                    if (id != null) {
                        predicates.add(criteriaBuilder.equal(root.get("id"), id));
                    }
                    if (customerId != null) {
                        predicates.add(criteriaBuilder.equal(root.get("customer_id"), customerId));
                    }
                    if (serviceId != null) {
                        predicates.add(criteriaBuilder.equal(root.get("service_id"), serviceId));
                    }
                    if (status != null) {
                        predicates.add(criteriaBuilder.equal(root.get("status"), status));
                    }
                    if (type != null) {
                        predicates.add(criteriaBuilder.equal(root.get("type"), type));
                    }
                    return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
                }
            };
            List<Order> orders = orderRepository.findAll(specification, Sort.by(Direction.ASC, "id"));
            return new ApiResult(true, orders);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult queryHotelOrder(Long id, Long customerId, Long serviceId, Status status) {
        try {
            Specification<Order> specification = new Specification<Order>() {
                @Override
                public Predicate toPredicate(Root<Order> root, CriteriaQuery<?> query,
                        CriteriaBuilder criteriaBuilder) {
                    List<Predicate> predicates = new ArrayList<>();
                    if (id != null) {
                        predicates.add(criteriaBuilder.equal(root.get("id"), id));
                    }
                    if (customerId != null) {
                        predicates.add(criteriaBuilder.equal(root.get("customer_id"), customerId));
                    }
                    if (serviceId != null) {
                        predicates.add(criteriaBuilder.equal(root.get("service_id"), serviceId));
                    }
                    if (status != null) {
                        predicates.add(criteriaBuilder.equal(root.get("status"), status));
                    }
                    return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
                }
            };
            List<Order> orders = orderRepository.findAll(specification, Sort.by(Direction.ASC, "id"));
            List<HotelOrder> hotelOrders = new ArrayList<>();
            for (Order order : orders) {
                if (order.getType() == Type.HOTEL) {
                    hotelOrders.add(new HotelOrder(order));
                }
            }
            return new ApiResult(true, hotelOrders);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult queryFlightOrder(Long id, Long customerId, Long serviceId, Status status) {
        try {
            Specification<Order> specification = new Specification<Order>() {
                @Override
                public Predicate toPredicate(Root<Order> root, CriteriaQuery<?> query,
                        CriteriaBuilder criteriaBuilder) {
                    List<Predicate> predicates = new ArrayList<>();
                    if (id != null) {
                        predicates.add(criteriaBuilder.equal(root.get("id"), id));
                    }
                    if (customerId != null) {
                        predicates.add(criteriaBuilder.equal(root.get("customer_id"), customerId));
                    }
                    if (serviceId != null) {
                        predicates.add(criteriaBuilder.equal(root.get("service_id"), serviceId));
                    }
                    if (status != null) {
                        predicates.add(criteriaBuilder.equal(root.get("status"), status));
                    }
                    return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
                }
            };
            List<Order> orders = orderRepository.findAll(specification, Sort.by(Direction.ASC, "id"));
            List<FlightOrder> flightOrders = new ArrayList<>();
            for (Order order : orders) {
                if (order.getType() == Type.FLIGHT) {
                    flightOrders.add(new FlightOrder(order));
                }
            }
            return new ApiResult(true, flightOrders);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult addOrder(Order order) {
        try {
            // update service
            if (order.getStatus() == Status.UNPAID || order.getStatus() == Status.PAID) {
                if (order.getType() == Type.HOTEL) {
                    HotelOrder hotelOrder = new HotelOrder(order);
                    Room room = roomRepository.findById(hotelOrder.getRoom_id()).orElse(null);
                    if (room == null) {
                        throw new Exception("Room not found");
                    }
                    StringBuffer sb = room.getBooked();
                    Date checkIn = new Date(hotelOrder.getCheck_in().getTime());
                    Date checkOut = new Date(hotelOrder.getCheck_out().getTime());
                    Calendar calendar = Calendar.getInstance();
                    calendar.set(Calendar.SECOND, 0);
                    calendar.set(Calendar.MINUTE, 0);
                    calendar.set(Calendar.HOUR_OF_DAY, 0);
                    calendar.set(Calendar.MILLISECOND, 0);
                    if (checkIn.compareTo(new Date(calendar.getTime().getTime())) < 0) {
                        throw new Exception("Check in date is earlier than today");
                    }
                    calendar.add(Calendar.DATE, Room.MAX_BOOKED);
                    Date maxDate = new Date(calendar.getTime().getTime());
                    if (checkIn.compareTo(checkOut) > 0) {
                        throw new Exception("Check in date is later than check out date");
                    }
                    if (checkOut.compareTo(maxDate) > 0) {
                        throw new Exception("Check out date is out of range");
                    }
                    // update room booked
                    updateRoomBooked(room);

                    // check if room is available
                    Long checkInDays = checkIn.getTime() - room.getStartDate().getTime();
                    checkInDays = checkInDays / (1000 * 60 * 60 * 24);
                    Long checkOutDays = checkOut.getTime() - room.getStartDate().getTime();
                    checkOutDays = checkOutDays / (1000 * 60 * 60 * 24);
                    for (int i = checkInDays.intValue(); i < checkOutDays.intValue(); i++) {
                        if ((((int) sb.charAt(i / 8)) & (1 << (i % 8))) == (1 << (i % 8))) {
                            throw new Exception("Room is not available");
                        }
                    }
                    for (int i = checkInDays.intValue(); i < checkOutDays.intValue(); i++) {
                        sb.setCharAt(i / 8, (char) (((int) sb.charAt(i / 8)) | (1 << (i % 8))));
                    }
                    room.setBooked(sb);
                    roomRepository.save(room);
                } else if (order.getType() == Type.FLIGHT) {
                    Flight flight = flightRepository.findById(order.getService_id()).orElse(null);
                    if (flight == null) {
                        throw new Exception("Flight not found");
                    }
                    StringBuffer sb = flight.getBooked();
                    // Integer seatId = new FlightOrder(order).getSeat_id();
                    // if (seatId >= flight.getSeatNum()) {
                    // throw new Exception("Seat id is out of range");
                    // }
                    // if ((((int) sb.charAt(seatId / 8)) & (1 << (seatId % 8))) == (1 << (seatId %
                    // 8))) {
                    // throw new Exception("Seat is not available");
                    // } else {
                    // sb.setCharAt(seatId / 8, (char) (((int) sb.charAt(seatId / 8)) | (1 <<
                    // (seatId % 8))));
                    // flight.setBooked(sb);
                    // flightRepository.save(flight);
                    // }
                    Integer seatId = null;
                    FlightOrder flightOrder = new FlightOrder(order);
                    for (int i = 0; i < flight.getSeatNum(); i++) {
                        if ((((int) sb.charAt(i / 8)) & (1 << (i % 8))) == 0) {
                            seatId = i;
                            flightOrder.setSeat_id(seatId);
                            order.setPayload(flightOrder.serialize());
                            sb.setCharAt(i / 8, (char) (((int) sb.charAt(i / 8)) | (1 << (i % 8))));
                            flight.setBooked(sb);
                            flightRepository.save(flight);
                            break;
                        }
                    }
                    if (seatId == null) {
                        throw new Exception("Seat is not available");
                    }
                } else {
                    throw new Exception("Invalid order type");
                }
            }

            order = orderRepository.save(order);
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult updateOrder(Order order) {
        try {
            // if status is changed, update service
            Order old_order = orderRepository.findById(order.getId()).orElse(null);
            if (old_order == null) {
                throw new Exception("Order not found");
            }
            if ((old_order.getStatus() == Status.UNPAID || old_order.getStatus() == Status.PAID)
                    && (order.getStatus() == Status.CANCELED || order.getStatus() == Status.FINISHED)) {
                if (order.getType() == Type.HOTEL) {
                    HotelOrder hotelOrder = new HotelOrder(order);
                    Room room = roomRepository.findById(hotelOrder.getRoom_id()).orElse(null);
                    if (room == null) {
                        throw new Exception("Room not found");
                    }
                    updateRoomBooked(room);
                    StringBuffer sb = room.getBooked();
                    Date checkIn = new Date(hotelOrder.getCheck_in().getTime());
                    Date checkOut = new Date(hotelOrder.getCheck_out().getTime());
                    Long checkInDays = checkIn.getTime() - room.getStartDate().getTime();
                    checkInDays = checkInDays / (1000 * 60 * 60 * 24);
                    Long checkOutDays = checkOut.getTime() - room.getStartDate().getTime();
                    checkOutDays = checkOutDays / (1000 * 60 * 60 * 24);
                    for (int i = checkInDays.intValue(); i < checkOutDays.intValue(); i++) {
                        sb.setCharAt(i / 8, (char) (((int) sb.charAt(i / 8)) & (~(1 << (i % 8))))); // set 0
                    }
                    room.setBooked(sb);
                    roomRepository.save(room);
                } else if (order.getType() == Type.FLIGHT) {
                    Flight flight = flightRepository.findById(order.getService_id()).orElse(null);
                    if (flight == null) {
                        throw new Exception("Flight not found");
                    }
                    StringBuffer sb = flight.getBooked();
                    Integer seatId = new FlightOrder(order).getSeat_id();
                    sb.setCharAt(seatId / 8, (char) (((int) sb.charAt(seatId / 8)) & (~(1 << (seatId % 8))))); // set 0
                    flight.setBooked(sb);
                    flightRepository.save(flight);
                } else {
                    throw new Exception("Invalid order type");
                }
            } else if ((old_order.getStatus() == Status.CANCELED || old_order.getStatus() == Status.FINISHED)
                    && (order.getStatus() == Status.UNPAID || order.getStatus() == Status.PAID)) {
                if (order.getType() == Type.HOTEL) {
                    HotelOrder hotelOrder = new HotelOrder(order);
                    Room room = roomRepository.findById(hotelOrder.getRoom_id()).orElse(null);
                    if (room == null) {
                        throw new Exception("Room not found");
                    }
                    updateRoomBooked(room);
                    StringBuffer sb = room.getBooked();
                    Date checkIn = new Date(hotelOrder.getCheck_in().getTime());
                    Date checkOut = new Date(hotelOrder.getCheck_out().getTime());
                    Long checkInDays = checkIn.getTime() - room.getStartDate().getTime();
                    checkInDays = checkInDays / (1000 * 60 * 60 * 24);
                    Long checkOutDays = checkOut.getTime() - room.getStartDate().getTime();
                    checkOutDays = checkOutDays / (1000 * 60 * 60 * 24);
                    for (int i = checkInDays.intValue(); i < checkOutDays.intValue(); i++) {
                        if ((((int) sb.charAt(i / 8)) & (1 << (i % 8))) != 0) {
                            throw new Exception("Room is booked");
                        }
                        sb.setCharAt(i / 8, (char) (((int) sb.charAt(i / 8)) | (1 << (i % 8))));
                    }
                    room.setBooked(sb);
                    roomRepository.save(room);
                } else if (order.getType() == Type.FLIGHT) {
                    Flight flight = flightRepository.findById(order.getService_id()).orElse(null);
                    if (flight == null) {
                        throw new Exception("Flight not found");
                    }
                    StringBuffer sb = flight.getBooked();
                    Integer seatId = new FlightOrder(order).getSeat_id();
                    if ((((int) sb.charAt(seatId / 8)) & (1 << (seatId % 8))) != 0) {
                        throw new Exception("Seat is booked");
                    }
                    sb.setCharAt(seatId / 8, (char) (((int) sb.charAt(seatId / 8)) | (1 << (seatId % 8))));
                    flight.setBooked(sb);
                    flightRepository.save(flight);
                } else {
                    throw new Exception("Invalid order type");
                }
            }

            order = orderRepository.save(order);
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult deleteOrder(Long id) {
        try {
            // update service
            Order order = orderRepository.findById(id).orElse(null);
            if (order == null) {
                throw new Exception("Order not found");
            }
            if (order.getStatus() == Status.PAID || order.getStatus() == Status.UNPAID) {
                if (order.getType() == Type.HOTEL) {
                    HotelOrder hotelOrder = new HotelOrder(order);
                    Room room = roomRepository.findById(hotelOrder.getRoom_id()).orElse(null);
                    if (room == null) {
                        throw new Exception("Room not found");
                    }
                    updateRoomBooked(room);
                    StringBuffer sb = room.getBooked();
                    Date checkIn = new Date(hotelOrder.getCheck_in().getTime());
                    Date checkOut = new Date(hotelOrder.getCheck_out().getTime());
                    Long checkInDays = checkIn.getTime() - room.getStartDate().getTime();
                    checkInDays = checkInDays / (1000 * 60 * 60 * 24);
                    Long checkOutDays = checkOut.getTime() - room.getStartDate().getTime();
                    checkOutDays = checkOutDays / (1000 * 60 * 60 * 24);
                    for (int i = checkInDays.intValue(); i < checkOutDays.intValue(); i++) {
                        sb.setCharAt(i / 8, (char) (((int) sb.charAt(i / 8)) & ~(1 << (i % 8))));
                    }
                    room.setBooked(sb);
                    roomRepository.save(room);
                } else if (order.getType() == Type.FLIGHT) {
                    Flight flight = flightRepository.findById(order.getService_id()).orElse(null);
                    if (flight == null) {
                        throw new Exception("Flight not found");
                    }
                    StringBuffer sb = flight.getBooked();
                    Integer seatId = new FlightOrder(order).getSeat_id();
                    sb.setCharAt(seatId / 8, (char) (((int) sb.charAt(seatId / 8)) & ~(1 << (seatId % 8))));
                    flight.setBooked(sb);
                    flightRepository.save(flight);
                } else {
                    throw new Exception("Invalid order type");
                }
            }
            orderRepository.deleteById(id);
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult resetOrder() {
        try {
            orderRepository.deleteAll();
            roomRepository.deleteAll();
            hotelRepository.deleteAll();
            flightRepository.deleteAll();
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    private Boolean updateRoomBooked(Room room) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date today = new Date(calendar.getTime().getTime());
        if (room.getStartDate().compareTo(today) < 0) {
            Long days = today.getTime() - room.getStartDate().getTime();
            days = days / (1000 * 60 * 60 * 24);
            StringBuffer sb1 = new StringBuffer();
            for (int i = days.intValue(); i < room.getBooked().capacity(); i++) {
                sb1.append(room.getBooked().charAt(i));
            }
            for (int i = 0; i < days.intValue(); i++) {
                sb1.append((char) 0);
            }
            room.setBooked(sb1);
            room.setStartDate(today);
            roomRepository.save(room);
        }
        return true;
    }
}
