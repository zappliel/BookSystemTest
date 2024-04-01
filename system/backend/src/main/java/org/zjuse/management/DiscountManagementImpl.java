package org.zjuse.management;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zjuse.entity.Discount;
import org.zjuse.entity.Flight;
import org.zjuse.entity.Hotel;
import org.zjuse.entity.Order.Type;
import org.zjuse.repository.DiscountRepository;
import org.zjuse.repository.FlightRepository;
import org.zjuse.repository.HotelRepository;
import org.zjuse.utils.ApiResult;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Service
@Transactional(rollbackFor = Exception.class, timeout = 300)
public class DiscountManagementImpl implements DiscountManagement {

    @Autowired
    private DiscountRepository discountRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Override
    public ApiResult queryDiscount(Long serviceId, Type type) {
        try {
            Specification<Discount> specification = new Specification<Discount>() {
                @Override
                public Predicate toPredicate(Root<Discount> root, CriteriaQuery<?> query,
                        CriteriaBuilder criteriaBuilder) {
                    List<Predicate> predicates = new ArrayList<>();
                    if (serviceId != null) {
                        predicates.add(criteriaBuilder.equal(root.get("serviceId"), serviceId));
                    }
                    if (type != null) {
                        predicates.add(criteriaBuilder.equal(root.get("type"), type));
                    }
                    return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
                }
            };
            List<Discount> discounts = discountRepository.findAll(specification, Sort.by(Direction.ASC, "id"));
            return new ApiResult(true, discounts);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult addDiscount(Discount discount) {
        try {
            ApiResult result = checkDiscount(discount);
            if (!result.ok) {
                return result;
            }

            discount = discountRepository.save(discount);
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult updateDiscount(Long id, Double discountFactor) {
        try {
            Discount discount = discountRepository.findById(id).orElse(null);
            if (discount == null) {
                throw new Exception("Discount not found");
            }
            discount.setDiscountFactor(discountFactor);
            discount = discountRepository.save(discount);
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult deleteDiscount(Long id) {
        try {
            discountRepository.deleteById(id);
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult resetDiscount() {
        try {
            discountRepository.deleteAll();
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    private ApiResult checkDiscount(Discount discount) {
        try {
            // check if the serviceId and type exist in service
            if (discount.getType() == Type.HOTEL) {
                Hotel hotel = hotelRepository.findById(discount.getServiceId()).orElse(null);
                if (hotel == null) {
                    throw new Exception("Hotel not found");
                }
            } else if (discount.getType() == Type.FLIGHT) {
                Flight flight = flightRepository.findById(discount.getServiceId()).orElse(null);
                if (flight == null) {
                    throw new Exception("Flight not found");
                }
            } else {
                throw new Exception("Invalid type");
            }

            // check if the discount is already exist
            Long serviceId = discount.getServiceId();
            Type type = discount.getType();
            Specification<Discount> specification = new Specification<Discount>() {
                @Override
                public Predicate toPredicate(Root<Discount> root, CriteriaQuery<?> query,
                        CriteriaBuilder criteriaBuilder) {
                    List<Predicate> predicates = new ArrayList<>();
                    predicates.add(criteriaBuilder.equal(root.get("serviceId"), serviceId));
                    predicates.add(criteriaBuilder.equal(root.get("type"), type));
                    return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
                }
            };
            Discount existDiscount = discountRepository.findOne(specification).orElse(null);
            if (existDiscount != null) {
                throw new Exception("Discount already exist");
            }
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }
}
