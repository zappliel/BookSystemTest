package org.zjuse.management;

import org.zjuse.entity.Discount;
import org.zjuse.entity.Order.Type;
import org.zjuse.utils.ApiResult;

public interface DiscountManagement {
    
    /**
     * query discount according to the given conditions
     * 
     * @param serviceId
     * @param type
     * @return status; the list of discounts will be returned in payload
     */
    ApiResult queryDiscount(Long serviceId, Type type);

    /**
     * add a new discount
     * 
     * @param discount
     * @return status; the id of the discount will be returned in discount
     */
    ApiResult addDiscount(Discount discount);

    /**
     * update a discount
     * (id cannot be changed)
     * 
     * @param id
     * @param discount
     * @return status
     */
    ApiResult updateDiscount(Long id, Double discount);

    /**
     * delete a discount
     * 
     * @param id
     * @return status
     */
    ApiResult deleteDiscount(Long id);

    /**
     * reset discount table
     * (all data will be deleted)
     * 
     * @return status
     */
    ApiResult resetDiscount();
}
