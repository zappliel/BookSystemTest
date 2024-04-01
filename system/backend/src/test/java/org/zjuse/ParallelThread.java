package org.zjuse;

import java.util.concurrent.Semaphore;
import java.util.concurrent.atomic.AtomicInteger;

import org.zjuse.entity.Order;
import org.zjuse.management.OrderManagement;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ParallelThread extends Thread {

    public static final int nThreads = 16;
    public static AtomicInteger successOps = new AtomicInteger(0);
    public static Semaphore semaphore = new Semaphore(nThreads);

    private final int id;
    private OrderManagement orderManagement;
    private final Order order;

    public ParallelThread(int id, OrderManagement orderManagement, Order order) {
        this.id = id;
        this.orderManagement = orderManagement;
        this.order = order;
    }

    @Override
    public void run() {
        try {
            log.info("Thread {} begin to wait signal", id);
            semaphore.acquire();
            log.info("Thread {} start to add order", id);
            if (orderManagement.addOrder(order).ok) {
                log.info("Thread {} add order successfully", id);
                successOps.incrementAndGet();
            } else {
                log.info("Thread {} add order failed", id);
            }
            semaphore.release();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public static void acquireAll() {
        try {
            semaphore.acquire(nThreads);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public static void releaseAll() {
        semaphore.release(nThreads);
    }
}
