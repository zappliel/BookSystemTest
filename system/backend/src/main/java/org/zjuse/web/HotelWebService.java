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
import org.zjuse.entity.Hotel;
import org.zjuse.management.HotelManagement;
import org.zjuse.utils.ApiResult;

import lombok.extern.slf4j.Slf4j;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/hotel")
@Slf4j
public class HotelWebService {

	@Autowired
	private HotelManagement hotelManagement;

	/**
	 * Query hotel by conditions
	 * 
	 * @param id
	 * @param name
	 * @param location
	 * @param minStar
	 * @param maxStar
	 * @param minScore
	 * @param maxScore
	 * @return List<Hotel>
	 */
	@GetMapping("/query")
	public List<Hotel> queryhotel(@RequestParam(value = "id", required = false) Long id,
			@RequestParam(value = "name", required = false) String name,
			@RequestParam(value = "location", required = false) String location,
			@RequestParam(value = "minStar", required = false) Integer minStar,
			@RequestParam(value = "maxStar", required = false) Integer maxStar,
			@RequestParam(value = "minScore", required = false) Double minScore,
			@RequestParam(value = "maxScore", required = false) Double maxScore) {
		ApiResult result = hotelManagement.queryHotel(id, name, location, minStar, maxStar, minScore, maxScore);
		if (!result.ok) {
			log.warn("Failed to query hotel, reason: " + result.message);
			return null;
		}
		return (List<Hotel>) result.payload;
	}

	/**
	 * Add a hotel
	 * 
	 * @param name
	 * @param location
	 * @param star
	 * @param score
	 * @return HttpStatus
	 */
	@PostMapping("/add")
	public HttpStatus addHotel(@RequestParam(value = "name", required = true) String name,
			@RequestParam(value = "location", required = true) String location,
			@RequestParam(value = "star", required = true) Integer star,
			@RequestParam(value = "score", required = true) Double score) {
		Hotel hotel = new Hotel(null, name, location, star, score);
		ApiResult result = hotelManagement.addHotel(hotel);
		if (!result.ok) {
			log.warn("Failed to add hotel, reason: " + result.message);
			return HttpStatus.BAD_REQUEST;
		}
		return HttpStatus.OK;
	}

	/**
	 * Update a hotel
	 * 
	 * @param id
	 * @param name
	 * @param location
	 * @param star
	 * @param score
	 * @return HttpStatus
	 */
	@PutMapping("/update")
	public HttpStatus updateHotel(@RequestParam(value = "id", required = true) Long id,
			@RequestParam(value = "name", required = false) String name,
			@RequestParam(value = "location", required = false) String location,
			@RequestParam(value = "star", required = false) Integer star,
			@RequestParam(value = "score", required = false) Double score) {
		Hotel hotel = new Hotel(id, name, location, star, score);
		ApiResult result = hotelManagement.updateHotel(hotel);
		if (!result.ok) {
			log.warn("Failed to update hotel, reason: " + result.message);
			return HttpStatus.BAD_REQUEST;
		}
		return HttpStatus.OK;
	}

	/**
	 * Delete a hotel
	 * 
	 * @param id
	 * @return HttpStatus
	 */
	@DeleteMapping("/delete")
	public HttpStatus deleteHotel(@RequestParam(value = "id", required = true) Long id) {
		ApiResult result = hotelManagement.deleteHotel(id);
		if (!result.ok) {
			log.warn("Failed to delete hotel, reason: " + result.message);
			return HttpStatus.BAD_REQUEST;
		}
		return HttpStatus.OK;
	}
}
