package org.zjuse.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.zjuse.entity.Discount;
import org.zjuse.entity.Order.Type;
import org.zjuse.management.DiscountManagement;
import org.zjuse.utils.ApiResult;

import lombok.extern.slf4j.Slf4j;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/discount")
@Slf4j
public class DiscountWebService {

    @Autowired
    private DiscountManagement discountManagement;

    /**
     * Query discount by conditions
     * 
     * @param serviceId
     * @param type
     * @return List<Discount>
     */
    @GetMapping("/query")
    public List<Discount> queryDiscount(@RequestParam(value = "serviceId", required = false) Long serviceId,
            @RequestParam(value = "type", required = false) Type type) {
        ApiResult result = discountManagement.queryDiscount(serviceId, type);
        if (!result.ok) {
            log.warn("Failed to query discount, reason: " + result.message);
            return null;
        }
        return (List<Discount>) result.payload;
    }

    /**
     * Add a discount
     * 
     * @param serviceId
     * @param type
     * @param discount
     * @return HttpStatus
     */
    @PostMapping("/add")
    public HttpStatus addDiscount(@RequestParam(value = "serviceId", required = true) Long serviceId,
            @RequestParam(value = "type", required = true) Type type,
            @RequestParam(value = "discountFactor", required = true) Double discountFactor) {
        Discount discount = new Discount(null, serviceId, type, discountFactor);
        ApiResult result = discountManagement.addDiscount(discount);
        if (!result.ok) {
            log.warn("Failed to add discount, reason: " + result.message);
            return HttpStatus.BAD_REQUEST;
        }
        return HttpStatus.OK;
    }

    /**
     * Update a discount
     * 
     * @param id
     * @param discountFactor
     * @return HttpStatus
     */
    @PutMapping("/update")
    public HttpStatus updateDiscount(@RequestParam(value = "id", required = true) Long id,
            @RequestParam(value = "discountFactor", required = true) Double discountFactor) {
        ApiResult result = discountManagement.updateDiscount(id, discountFactor);
        if (!result.ok) {
            log.warn("Failed to update discount, reason: " + result.message);
            return HttpStatus.BAD_REQUEST;
        }
        return HttpStatus.OK;
    }

    /**
     * Delete a discount
     * 
     * @param id
     * @return HttpStatus
     */
    @DeleteMapping("/delete")
    public HttpStatus deleteDiscount(@RequestParam(value = "id", required = true) Long id) {
        ApiResult result = discountManagement.deleteDiscount(id);
        if (!result.ok) {
            log.warn("Failed to delete discount, reason: " + result.message);
            return HttpStatus.BAD_REQUEST;
        }
        return HttpStatus.OK;
    }
    
}
