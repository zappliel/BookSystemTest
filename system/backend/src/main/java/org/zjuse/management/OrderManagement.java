package org.zjuse.management;

import org.zjuse.entity.Order;
import org.zjuse.entity.Order.Status;
import org.zjuse.entity.Order.Type;
import org.zjuse.utils.ApiResult;

public interface OrderManagement {

    /**
     * query orders according the given conditions(sorted by id)
     * 
     * @param customerId
     * @param serviceId
     * @param status
     * @param type
     * @return status; the list of orders will be returned in payload
     */
    ApiResult queryOrder(Long id, Long customerId, Long serviceId, Status status, Type type);

    ApiResult queryHotelOrder(Long id, Long customerId, Long serviceId, Status status);

    ApiResult queryFlightOrder(Long id, Long customerId, Long serviceId, Status status);

    /**
     * add a new order
     * 
     * @param order
     * @return status; the id of the order will be returned in order
     */
    ApiResult addOrder(Order order);

    /**
     * update a order
     * (id cannot be changed)
     * 
     * @param order the order to be updated
     * @return status
     */
    ApiResult updateOrder(Order order);

    /**
     * delete a order
     * 
     * @param id the id of the order to be deleted
     * @return status
     */
    ApiResult deleteOrder(Long id);

    /**
     * reset order table
     * (all data will be deleted)
     * 
     * @return status
     */
    ApiResult resetOrder();
}
