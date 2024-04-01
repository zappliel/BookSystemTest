package org.zjuse.management;

import java.sql.Date;

import org.zjuse.entity.Flight;
import org.zjuse.utils.ApiResult;

public interface FlightManagement {

    /**
     * query flights according the given conditions(sorted by id)
     * 
     * @param id
     * @param from
     * @param to
     * @param minDate
     * @param maxDate
     * @param minScore
     * @param maxScore
     * @param minPrice
     * @param maxPrice
     * @return status; the list of flights will be returned in payload
     */
    ApiResult queryFlight(Long id, String from, String to, Date minDate, Date maxDate, Double minScore,
            Double maxScore, Double minPrice, Double maxPrice);

    /**
     * add a new flight
     * 
     * @param flight the flight to be added
     * @return status; the id of the flight will be returned in flight
     */
    ApiResult addFlight(Flight flight);

    /**
     * update a flight
     * (id cannot be changed)
     * 
     * @param flight the flight to be updated
     * @return status
     */
    ApiResult updateFlight(Flight flight);

    /**
     * delete a flight
     * (comments related to this flight will be deleted automatically)
     * (if there are orders related to this flight and the order is not finished,
     * the flight cannot be deleted)
     * 
     * @param id the id of the flight to be deleted
     * @return status
     */
    ApiResult deleteFlight(Long id);

    /**
     * reset flight table
     * (all data will be deleted)
     * 
     * @return status
     */
    ApiResult resetFlight();
}
