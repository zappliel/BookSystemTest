package org.zjuse.management;

import java.sql.Date;
import java.sql.Timestamp;
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
import org.zjuse.entity.Flight;
import org.zjuse.entity.Order;
import org.zjuse.entity.Order.Status;
import org.zjuse.entity.Order.Type;
import org.zjuse.repository.FlightRepository;
import org.zjuse.utils.ApiResult;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional(rollbackFor = Exception.class, timeout = 300)
public class FlightManagementImpl implements FlightManagement {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private OrderManagement orderManagement;

    @Autowired
    private CommentManagement commentManagement;

    @Autowired
    private DiscountManagement discountManagement;

    @Override
    public ApiResult queryFlight(Long id, String from, String to, Date minDate, Date maxDate, Double minScore,
            Double maxScore, Double minPrice, Double maxPrice) {
        try {
            Specification<Flight> specification = new Specification<Flight>() {
                @Override
                public Predicate toPredicate(Root<Flight> root, CriteriaQuery<?> query,
                        CriteriaBuilder criteriaBuilder) {
                    List<Predicate> predicates = new ArrayList<>();
                    if (id != null) {
                        predicates.add(criteriaBuilder.equal(root.get("id"), id));
                    }
                    if (from != null) {
                        predicates.add(criteriaBuilder.like(root.get("from"), "%" + from + "%"));
                    }
                    if (to != null) {
                        predicates.add(criteriaBuilder.like(root.get("to"), "%" + to + "%"));
                    }
                    if (minDate != null) {
                        predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("departureTime"),
                                new Timestamp(minDate.getTime())));
                    }
                    if (maxDate != null) {
                        predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("departureTime"),
                                new Timestamp(maxDate.getTime())));
                    }
                    if (minScore != null) {
                        predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("score"), minScore));
                    }
                    if (maxScore != null) {
                        predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("score"), maxScore));
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
            List<Flight> flights = flightRepository.findAll(specification, Sort.by(Direction.ASC, "id"));
            return new ApiResult(true, flights);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult addFlight(Flight flight) {
        try {
            flight = flightRepository.save(flight);
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult updateFlight(Flight flight) {
        try {
            flight = flightRepository.save(flight);
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult deleteFlight(Long id) {
        try {
            // check if there are orders related to this flight and the order is not
            // finished
            ApiResult unpaid = orderManagement.queryOrder(null, null, id, Status.UNPAID, Type.FLIGHT);
            ApiResult paid = orderManagement.queryOrder(null, null, id, Status.PAID, Type.FLIGHT);
            if (!unpaid.ok || !paid.ok) {
                throw new Exception("Failed to query orders related to this flight.");
            }
            if ((List<Order>) unpaid.payload != null && ((List<Order>) unpaid.payload).size() > 0 ||
                    (List<Order>) paid.payload != null && ((List<Order>) paid.payload).size() > 0) {
                return new ApiResult(false, "There are orders related to this flight and the order is not finished.");
            }
            // delete orders related to this flight
            ApiResult order = orderManagement.queryOrder(null, null, id, null, Type.FLIGHT);
            if (!order.ok) {
                throw new Exception("Failed to query orders related to this flight.");
            }
            if ((List<Order>) order.payload != null && ((List<Order>) order.payload).size() > 0) {
                log.info("There are orders related to this flight, tring to delete them.");
                for (Order o : (List<Order>) order.payload) {
                    orderManagement.deleteOrder(o.getId());
                }
            }

            // delete comments related to this flight
            ApiResult comment = commentManagement.queryComment(null, id, Type.FLIGHT);
            if (!comment.ok) {
                throw new Exception("Failed to query comments related to this flight.");
            }
            if ((List<Comment>) comment.payload != null && ((List<Comment>) comment.payload).size() > 0) {
                log.info("There are comments related to this flight, tring to delete them.");
                for (Comment c : (List<Comment>) comment.payload) {
                    commentManagement.deleteComment(c.getId());
                }
            }

            // delete discount related to this flight
            ApiResult discount = discountManagement.queryDiscount(id, Type.FLIGHT);
            if (!discount.ok) {
                throw new Exception("Failed to query discounts related to this flight.");
            }
            if ((List<Discount>) discount.payload != null && ((List<Discount>) discount.payload).size() > 0) {
                log.info("There are discounts related to this flight, tring to delete them.");
                for (Discount d : (List<Discount>) discount.payload) {
                    discountManagement.deleteDiscount(d.getId());
                }
            }

            flightRepository.deleteById(id);
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult resetFlight() {
        try {
            orderManagement.resetOrder();
            commentManagement.resetComment();
            discountManagement.resetDiscount();
            flightRepository.deleteAll();
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }
}
