package org.zjuse.utils;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.Random;

import org.apache.commons.lang3.RandomUtils;
import org.zjuse.entity.Comment;
import org.zjuse.entity.Discount;
import org.zjuse.entity.Flight;
import org.zjuse.entity.FlightOrder;
import org.zjuse.entity.Hotel;
import org.zjuse.entity.HotelOrder;
import org.zjuse.entity.Order;
import org.zjuse.entity.Order.Status;
import org.zjuse.entity.Order.Type;
import org.zjuse.entity.Room;

public final class RandomData {

    public static final List<String> hotelNames = Arrays.asList(
            "Hilton", "Marriott", "Sheraton", "Hyatt", "Shangri-La", "Four Seasons", "InterContinental", "Westin",
            "Ritz-Carlton", "Waldorf Astoria");
    public static final List<String> location = Arrays.asList(
            "Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Hangzhou", "Chengdu", "Chongqing", "Wuhan", "Tianjin",
            "Nanjing");
    public static final List<String> room_class = Arrays.asList(
            "Single", "Double", "Triple", "Quad", "Queen", "King", "Twin", "Double-double", "Studio", "Master Suite");
    public static final List<String> content = Arrays.asList(
            "Very good", "Good", "Normal", "Bad", "Very bad");

    public static String randomHotelName() {
        return hotelNames.get(new Random().nextInt(hotelNames.size()));
    }

    public static String randomLocation() {
        return location.get(new Random().nextInt(location.size()));
    }

    public static Integer randomStar() {
        return RandomUtils.nextInt(1, 5);
    }

    public static Double randomScore() {
        double v = RandomUtils.nextDouble(0.1, 100.0);
        return Double.parseDouble(String.format("%.2f", v));
    }

    public static Double randomPrice() {
        double v = RandomUtils.nextDouble(0.1, 10000.0);
        return Double.parseDouble(String.format("%.2f", v));
    }

    public static Timestamp randomTimestamp(int min, int max) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, new Random().nextInt(max - min) + min);
        return new Timestamp(calendar.getTimeInMillis());
    }

    public static Long randomId() {
        return RandomUtils.nextLong(0, 100000000000L);
    }

    public static Status randomStatus() {
        return Status.values()[new Random().nextInt(Status.values().length)];
    }

    public static String randomClass() {
        return room_class.get(new Random().nextInt(room_class.size()));
    }

    public static String randomContent() {
        return content.get(new Random().nextInt(content.size()));
    }

    public static Integer randomSeatNum() {
        return RandomUtils.nextInt(100, 200);
    }

    public static Date randomDate(int min, int max) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        calendar.add(Calendar.DATE, new Random().nextInt(min, max));
        return new Date(calendar.getTime().getTime());
    }

    public static Double randomDiscountFactor() {
        return RandomUtils.nextDouble(0.1, 1.0);
    }

    public static Hotel randomHotel() {
        return new Hotel(null, randomHotelName(), randomLocation(), randomStar(), randomScore());
    }

    public static Flight randomFlight() {
        return new Flight(null, randomLocation(), randomLocation(), randomTimestamp(0, 5), randomTimestamp(5, 10),
                randomScore(),
                randomPrice(), randomSeatNum());
    }

    public static Order randomHotelOrder(Long room_id, Long hotel_id) {
        HotelOrder hotelOrder = new HotelOrder(null, randomId(),
                hotel_id, randomStatus(), randomPrice(),
                room_id, randomDate(0, 5), randomDate(5, 10));
        return new Order(hotelOrder);
    }

    public static Order randomFlightOrder(Long flight_id) {
        FlightOrder flightOrder = new FlightOrder(null, randomId(), flight_id, randomStatus(), randomPrice(),
                null);
        return new Order(flightOrder);
    }

    public static Room randomRoom(Hotel hotel) {
        return new Room(null, hotel, randomClass(), randomPrice());
    }

    public static Comment randomComment(Long service_id, Type type) {
        Comment comment = null;
        if (type == Type.HOTEL) {
            comment = new Comment(null, randomId(), service_id, Type.HOTEL, randomScore(), randomContent());
        } else if (type == Type.FLIGHT) {
            comment = new Comment(null, randomId(), service_id, Type.FLIGHT, randomScore(), randomContent());
        }
        return comment;
    }

    public static Discount randomHotelDiscount(Hotel hotel) {
        return new Discount(null, hotel.getId(), Type.HOTEL, randomDiscountFactor());
    }

    public static Discount randomFlightDiscount(Flight flight) {
        return new Discount(null, flight.getId(), Type.FLIGHT, randomDiscountFactor());
    }
}
