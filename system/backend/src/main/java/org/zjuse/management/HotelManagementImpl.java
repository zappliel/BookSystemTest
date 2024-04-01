package org.zjuse.management;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zjuse.entity.Comment;
import org.zjuse.entity.Discount;
import org.zjuse.entity.Hotel;
import org.zjuse.entity.Order;
import org.zjuse.entity.Order.Status;
import org.zjuse.entity.Order.Type;
import org.zjuse.entity.Room;
import org.zjuse.repository.HotelRepository;
import org.zjuse.utils.ApiResult;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional(rollbackFor = Exception.class, timeout = 300)
public class HotelManagementImpl implements HotelManagement {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private OrderManagement orderManagement;

    @Autowired
    private RoomManagement roomManagement;

    @Autowired
    private CommentManagement commentManagement;

    @Autowired
    private DiscountManagement discountManagement;

    @Override
    public ApiResult queryHotel(Long id, String name, String location, Integer minStar, Integer maxStar,
            Double minScore,
            Double maxScore) {
        try {
            Specification<Hotel> specification = new Specification<Hotel>() {
                @Override
                public Predicate toPredicate(Root<Hotel> root, CriteriaQuery<?> query,
                        CriteriaBuilder criteriaBuilder) {
                    List<Predicate> predicates = new ArrayList<>();
                    if (id != null) {
                        predicates.add(criteriaBuilder.equal(root.get("id"), id));
                    }
                    if (name != null) {
                        predicates.add(criteriaBuilder.like(root.get("name"), "%" + name + "%"));
                    }
                    if (location != null) {
                        predicates.add(criteriaBuilder.like(root.get("location"), "%" + location + "%"));
                    }
                    if (minStar != null) {
                        predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("star"), minStar));
                    }
                    if (maxStar != null) {
                        predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("star"), maxStar));
                    }
                    if (minScore != null) {
                        predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("score"), minScore));
                    }
                    if (maxScore != null) {
                        predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("score"), maxScore));
                    }

                    return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
                }
            };
            List<Hotel> hotels = hotelRepository.findAll(specification, Sort.by(Direction.ASC, "id"));
            return new ApiResult(true, hotels);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult addHotel(Hotel hotel) {
        try {
            hotel = hotelRepository.save(hotel);
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult updateHotel(Hotel hotel) {
        try {
            hotel = hotelRepository.save(hotel);
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult deleteHotel(Long id) {
        try {
            // check if there are orders related to this hotel and the order is not finished
            ApiResult unpaid = orderManagement.queryOrder(null, null, id, Status.UNPAID, Type.HOTEL);
            ApiResult paid = orderManagement.queryOrder(null, null, id, Status.PAID, Type.HOTEL);
            if (!unpaid.ok || !paid.ok) {
                throw new Exception("Failed to query orders related to this hotel.");
            }
            if ((List<Order>) unpaid.payload != null && ((List<Order>) unpaid.payload).size() > 0 ||
                    (List<Order>) paid.payload != null && ((List<Order>) paid.payload).size() > 0) {
                throw new Exception("There are orders related to this hotel and the order is not finished.");
            }
            // delete orders related to this hotel
            ApiResult order = orderManagement.queryOrder(null, null, id, null, Type.HOTEL);
            if (!order.ok) {
                throw new Exception("Failed to query orders related to this hotel.");
            }
            if ((List<Order>) order.payload != null && ((List<Order>) order.payload).size() > 0) {
                log.info("There are orders related to this hotel, tring to delete them.");
                for (Order o : (List<Order>) order.payload) {
                    orderManagement.deleteOrder(o.getId());
                }
            }

            // delete rooms related to this hotel
            ApiResult room = roomManagement.queryRoom(id, null, null, null);
            if (!room.ok) {
                throw new Exception("Failed to query rooms related to this hotel.");
            }
            if ((List<Room>) room.payload != null && ((List<Room>) room.payload).size() > 0) {
                log.info("There are rooms related to this hotel, tring to delete them.");
                for (Room r : (List<Room>) room.payload) {
                    roomManagement.deleteRoom(r.getId());
                }
            }

            // delete comments related to this hotel
            ApiResult comment = commentManagement.queryComment(null, id, Type.HOTEL);
            if (!comment.ok) {
                throw new Exception("Failed to query comments related to this hotel.");
            }
            if ((List<Comment>) comment.payload != null && ((List<Comment>) comment.payload).size() > 0) {
                log.info("There are comments related to this hotel, tring to delete them.");
                for (Comment c : (List<Comment>) comment.payload) {
                    commentManagement.deleteComment(c.getId());
                }
            }

            // delete discount related to this hotel
            ApiResult discount = discountManagement.queryDiscount(id, Type.HOTEL);
            if (!discount.ok) {
                throw new Exception("Failed to query discount related to this hotel.");
            }
            if ((List<Discount>) discount.payload != null && ((List<Discount>) discount.payload).size() > 0) {
                log.info("There are discount related to this hotel, tring to delete them.");
                for (Discount d : (List<Discount>) discount.payload) {
                    discountManagement.deleteDiscount(d.getId());
                }
            }

            hotelRepository.deleteById(id);
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult resetHotel() {
        try {
            orderManagement.resetOrder();
            roomManagement.resetRoom();
            commentManagement.resetComment();
            discountManagement.resetDiscount();
            hotelRepository.deleteAll();
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }
}
