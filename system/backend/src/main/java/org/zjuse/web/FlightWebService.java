package org.zjuse.web;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.zjuse.entity.Flight;
import org.zjuse.management.FlightManagement;
import org.zjuse.utils.ApiResult;

import lombok.extern.slf4j.Slf4j;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/flight")
@Slf4j
public class FlightWebService {

	@Autowired
	private FlightManagement flightManagement;

	/**
	 * Query flight by conditions
	 * 
	 * @param id
	 * @param from
	 * @param to
	 * @param minDate  the min date of the flight's departure time
	 * @param maxDate  the max date of the flight's departure time
	 *                 The query range is [minDate 00:00:00, maxDate 00:00:00]
	 * @param minScore
	 * @param maxScore
	 * @param minPrice
	 * @param maxPrice
	 * @return List<Flight>
	 */
	@GetMapping("/query")
	public List<Flight> queryFlight(@RequestParam(value = "id", required = false) Long id,
			@RequestParam(value = "from", required = false) String from,
			@RequestParam(value = "to", required = false) String to,
			@RequestParam(value = "minDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date minDateUtil,
			@RequestParam(value = "maxDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date maxDateUtil,
			@RequestParam(value = "minScore", required = false) Double minScore,
			@RequestParam(value = "maxScore", required = false) Double maxScore,
			@RequestParam(value = "minPrice", required = false) Double minPrice,
			@RequestParam(value = "maxPrice", required = false) Double maxPrice) {
		java.sql.Date minDate = null;
		java.sql.Date maxDate = null;
		if (minDateUtil != null) {
			minDate = new java.sql.Date(minDateUtil.getTime());
		}
		if (maxDateUtil != null) {
			maxDate = new java.sql.Date(maxDateUtil.getTime());
		}
		ApiResult result = flightManagement.queryFlight(id, from, to, minDate, maxDate, minScore, maxScore, minPrice,
				maxPrice);
		if (!result.ok) {
			log.warn("Failed to query flight, reason: " + result.message);
			return null;
		}
		return (List<Flight>) result.payload;
	}

	/**
	 * Add a flight
	 * 
	 * @param from
	 * @param to
	 * @param departureTime
	 * @param arrivalTime
	 * @param price
	 * @param score
	 * @param seatNum
	 * @return HttpStatus
	 */
	@PostMapping("/add")
	public HttpStatus addFlight(@RequestParam(value = "from", required = true) String from,
			@RequestParam(value = "to", required = true) String to,
			@RequestParam(value = "departureTime", required = true) Long departureTimestamp,
			@RequestParam(value = "arrivalTime", required = true) Long arrivalTimestamp,
			@RequestParam(value = "price", required = true) Double price,
			@RequestParam(value = "score", required = true) Double score,
			@RequestParam(value = "seatNum", required = true) Integer seatNum) {
		log.info("add flight: " + from + " " + to + " " + departureTimestamp + " " + arrivalTimestamp + " " + price
				+ " " + score + " " + seatNum);
		Timestamp departureTime = null;
		Timestamp arrivalTime = null;
		if (departureTimestamp != null) {
			departureTime = new Timestamp(departureTimestamp);
		}
		if (arrivalTimestamp != null) {
			arrivalTime = new Timestamp(arrivalTimestamp);
		}
		Flight flight = new Flight(null, from, to, departureTime, arrivalTime, price, score, seatNum);
		ApiResult result = flightManagement.addFlight(flight);
		if (!result.ok) {
			log.warn("Failed to add flight, reason: " + result.message);
			return HttpStatus.BAD_REQUEST;
		}
		return HttpStatus.OK;
	}

	/**
	 * Update a flight
	 * 
	 * @param id
	 * @param from
	 * @param to
	 * @param departureTime
	 * @param arrivalTime
	 * @param price
	 * @param score
	 * @return HttpStatus
	 */
	@PutMapping("/update")
	public HttpStatus updateFlight(@RequestParam(value = "id", required = true) Long id,
			@RequestParam(value = "from", required = false) String from,
			@RequestParam(value = "to", required = false) String to,
			@RequestParam(value = "departureTime", required = false) Long departureTimestamp,
			@RequestParam(value = "arrivalTime", required = false) Long arrivalTimestamp,
			@RequestParam(value = "price", required = false) Double price,
			@RequestParam(value = "score", required = false) Double score,
			@RequestParam(value = "seatNum", required = false) Integer seatNum) {
		Timestamp departureTime = null;
		Timestamp arrivalTime = null;
		if (departureTimestamp != null) {
			departureTime = new Timestamp(departureTimestamp);
		}
		if (arrivalTimestamp != null) {
			arrivalTime = new Timestamp(arrivalTimestamp);
		}
		Flight flight = new Flight(id, from, to, departureTime, arrivalTime, price, score, seatNum);
		ApiResult result = flightManagement.updateFlight(flight);
		if (!result.ok) {
			log.warn("Failed to update flight, reason: " + result.message);
			return HttpStatus.BAD_REQUEST;
		}
		return HttpStatus.OK;
	}

	/**
	 * Delete a flight
	 * 
	 * @param id
	 * @return HttpStatus
	 */
	@DeleteMapping("/delete")
	public HttpStatus deleteFlight(@RequestParam(value = "id", required = true) Long id) {
		ApiResult result = flightManagement.deleteFlight(id);
		if (!result.ok) {
			log.warn("Failed to delete flight, reason: " + result.message);
			return HttpStatus.BAD_REQUEST;
		}
		return HttpStatus.OK;
	}
}
