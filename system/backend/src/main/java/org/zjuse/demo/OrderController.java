package org.zjuse.demo;

import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Controller
@CrossOrigin(origins = "*")
@RequestMapping(value = "/order")
public class OrderController {
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private ItemRepository itemRepository;
    //查找全部
    @RequestMapping(value = "/find", method = RequestMethod.GET)
    @ResponseBody
    public List<Orders> list(@RequestParam(name = "name", required = false) String name,
                             @RequestParam(name = "state", required = false) Integer state,
                             @RequestParam(name = "price", required = false) Integer price,
                             @RequestParam(name = "time", required = false) Integer time,
                             @RequestParam(name = "buyer", required = false) Integer buyer,
                             @RequestParam(name = "seller", required = false) Integer seller) {

        // 构建查询条件
        Specification<Orders> specification = (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (name != null) {
                predicates.add(criteriaBuilder.like(root.get("productName"), "%" + name + "%"));
            }
            if (state != null) {
                predicates.add(criteriaBuilder.equal(root.get("orderState"), state));
            }
            if (price != null) {
                if(price == 1)
                    predicates.add(criteriaBuilder.between(root.get("money"), 0,50));
                else if(price == 2)
                    predicates.add(criteriaBuilder.between(root.get("money"), 50,200));
                else if(price == 3)
                    predicates.add(criteriaBuilder.between(root.get("money"), 200,500));
                else if(price == 4)
                    predicates.add(criteriaBuilder.greaterThan(root.get("money"), 500));
            }
            if (time != null) {
                LocalDateTime now = LocalDateTime.now();
                if(time == 1) {
                    LocalDateTime todayStart = now.withHour(0).withMinute(0).withSecond(0).withNano(0);
                    predicates.add(criteriaBuilder.between(root.get("payTime"), todayStart, now));
                }
                else if(time == 2){
                    Duration duration = Duration.ofDays(7);
                    LocalDateTime weekAgo = now.minus(duration);
                    predicates.add(criteriaBuilder.between(root.get("payTime"), weekAgo,now));
                }else if(time == 3){
                    Duration duration = Duration.ofDays(7);
                    LocalDateTime weekAgo = now.minus(duration);
                    Duration duration2 = Duration.ofDays(15);
                    LocalDateTime weekAgo2 = now.minus(duration2);
                    predicates.add(criteriaBuilder.between(root.get("payTime"), weekAgo2,weekAgo));
                }else if(time == 4){
                    Duration duration2 = Duration.ofDays(15);
                    LocalDateTime weekAgo2 = now.minus(duration2);
                    predicates.add(criteriaBuilder.lessThan(root.get("payTime"), weekAgo2));
                }
            }
            if(buyer != null){
                predicates.add(criteriaBuilder.equal(root.get("buyerId"), buyer));
            }
            if(seller != null){
                predicates.add(criteriaBuilder.equal(root.get("sellerId"), seller));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        // 执行查询
        return orderItemRepository.findAll(specification);
    }

    //插入
    @PostMapping("/insert")
    @RequestMapping(value = "/insert",method = RequestMethod.GET)
    @ResponseBody
    public Orders insert(@RequestParam("buyerId") int buyerId,@RequestParam("id") int productId,
                         @RequestParam("num") int num, @RequestParam("state") int state,
                         @RequestParam("money") Double money){
        Orders orders = new Orders();
        Item item = itemRepository.findById(productId).get(0);
        orders.setNum(num);
        orders.setProductId(productId);
        orders.setMoney(money);
        orders.setSellerId(item.getSellerId());
        orders.setOrderState(state);
        orders.setBuyerId(buyerId);
        orders.setCreateTime(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));//设置创建时间为当前
        if(state == 2){
            orders.setPayTime(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));//支付时间
        }
        orders.setProductName(item.getName());
        return orderItemRepository.save(orders);
    }

    @RequestMapping(value = "/update",method = RequestMethod.GET)
    @ResponseBody
    public void update(@RequestParam("id") int id,@RequestParam("state") int state,
            @RequestParam(name = "finished", required = false) Integer finish,
                       @RequestParam(name = "complaint", required = false) String complaint,
                       @RequestParam(name = "refund", required = false) String refund){
        Orders orders = orderItemRepository.findByOrderId(id);
        orders.setOrderState(state);
        if(state == 2)
            orders.setPayTime(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
        if(finish != null)
            orders.setFinishTime(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
        if(complaint != null)
            orders.setComplaint(complaint);
        if(refund != null)
            orders.setRefund(refund);
        orderItemRepository.save(orders);
    }

}

