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
import org.zjuse.entity.Flight;
import org.zjuse.entity.Hotel;
import org.zjuse.entity.Order.Type;
import org.zjuse.repository.CommentRepository;
import org.zjuse.repository.FlightRepository;
import org.zjuse.repository.HotelRepository;
import org.zjuse.utils.ApiResult;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Service
@Transactional(rollbackFor = Exception.class, timeout = 300)
public class CommentManagementImpl implements CommentManagement {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Override
    public ApiResult queryComment(Long customerId, Long serviceId, Type type) {
        try {
            Specification<Comment> specification = new Specification<Comment>() {
                @Override
                public Predicate toPredicate(Root<Comment> root, CriteriaQuery<?> query,
                        CriteriaBuilder criteriaBuilder) {
                    List<Predicate> predicates = new ArrayList<>();
                    if (customerId != null) {
                        predicates.add(criteriaBuilder.equal(root.get("customerId"), customerId));
                    }
                    if (serviceId != null) {
                        predicates.add(criteriaBuilder.equal(root.get("serviceId"), serviceId));
                    }
                    if (type != null) {
                        predicates.add(criteriaBuilder.equal(root.get("type"), type));
                    }
                    return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
                }
            };
            List<Comment> comments = commentRepository.findAll(specification, Sort.by(Direction.ASC, "id"));
            return new ApiResult(true, comments);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult addComment(Comment comment) {
        try {
            ApiResult result = checkComment(comment);
            if (!result.ok) {
                return result;
            }
            comment = commentRepository.save(comment);
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult updateComment(Long id, Double score, String content) {
        try {
            Comment comment = commentRepository.findById(id).orElse(null);
            if (comment == null) {
                throw new Exception("Comment not found");
            }
            if (score != null) {
                comment.setScore(score);
            }
            if (content != null) {
                comment.setContent(content);
            }
            comment = commentRepository.save(comment);
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult deleteComment(Long id) {
        try {
            commentRepository.deleteById(id);
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    @Override
    public ApiResult resetComment() {
        try {
            commentRepository.deleteAll();
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }

    private ApiResult checkComment(Comment comment) {
        try {
            // check serviceId and type is valid
            if (comment.getType() == Type.HOTEL) {
                Hotel hotel = hotelRepository.findById(comment.getServiceId()).orElse(null);
                if (hotel == null) {
                    throw new Exception("Hotel not found");
                }
            } else if (comment.getType() == Type.FLIGHT) {
                Flight flight = flightRepository.findById(comment.getServiceId()).orElse(null);
                if (flight == null) {
                    throw new Exception("Flight not found");
                }
            } else {
                throw new Exception("Invalid type");
            }
            return new ApiResult(true, null);
        } catch (Exception e) {
            return new ApiResult(false, e.getMessage());
        }
    }
}
