package org.zjuse.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@CrossOrigin(origins = "*")
@RequestMapping(value = "/item")
public class ItemController {
    @Autowired
    private ItemRepository itemRepository;

    @RequestMapping(value = "/find",method = RequestMethod.GET)
    @ResponseBody
    public List<Item> getList(@RequestParam(name = "seller", required = false) Integer seller) {
        if(seller != null){
            return itemRepository.findBySellerId(seller);
        }
        return itemRepository.findAll();
    }
//降序
    Sort sort1 = Sort.by(Sort.Direction.DESC, "price");
    @RequestMapping(value = "/findHigh",method = RequestMethod.GET)
    @ResponseBody
    public List<Item> getListHigh() {
        return itemRepository.findAll(sort1);
    }
//升序
    Sort sort2 = Sort.by(Sort.Direction.ASC, "price");
    @RequestMapping(value = "/findLow",method = RequestMethod.GET)
    @ResponseBody
    public List<Item> getListLow() {
        return itemRepository.findAll(sort2);
    }
    //模糊查找
    @PostMapping("/findName")
    @RequestMapping(value = "/findName",method = RequestMethod.GET)
    @ResponseBody
    public List<Item> getListName(@RequestParam("name") String name,@RequestParam(name = "seller", required = false) Integer seller) {
        if(seller != null)
            return itemRepository.findByIdAndNameLike(seller,name);
        return itemRepository.findByNameLike("%"+name+"%");
    }

    @PostMapping("/findid")
    @RequestMapping(value = "/findid",method = RequestMethod.GET)
    @ResponseBody
    public List<Item> getListId(@RequestParam("id") int id) {
        return itemRepository.findById(id);
    }

    @PostMapping("/insert")
    @RequestMapping(value = "/insert",method = RequestMethod.GET)
    @ResponseBody
    public Item insert(@RequestParam("name") String name, @RequestParam("price") double price,
                       @RequestParam("stock") int stock,@RequestParam("description") String description,
                       @RequestParam("img") String img,@RequestParam("seller") int seller) {
        Item item = new Item();
        item.setName(name);
        item.setPrice(price);
        item.setStock(stock);
        item.setDescription(description);
        item.setImg(img);
        item.setSellerId(seller);
        item.setSold(0);
        return itemRepository.save(item);
    }

    @RequestMapping(value = "/update",method = RequestMethod.GET)
    @ResponseBody
    public void update(@RequestParam(name = "id",required = true) int id,
                       @RequestParam(name = "name", required = false) String name,
                       @RequestParam(name = "stock", required = false) Integer stock,
                       @RequestParam(name = "price", required = false) Double price,
                       @RequestParam(name = "description", required = false) String des,
                       @RequestParam(name = "img",required = false) String img)  {
        List<Item> list = itemRepository.findById(id);
        Item item = list.get(0);
        if(price != null || name != null || des != null || img != null){//更新商品
            if(price != null)
                item.setPrice(price);
            if(name != null)
                item.setName(name);
            if(des != null)
                item.setDescription(des);
            if(img != null)
                item.setImg(img);
            if(stock != null)
                item.setStock(stock);
            itemRepository.save(item);
        }else{//更新库存
            int newStock = list.get(0).getStock()+stock;
            int newSold = list.get(0).getSold()-stock;
            item.setStock(newStock);
            item.setSold(newSold);
            itemRepository.save(item);
        }
    }

    @RequestMapping(value = "/delete",method = RequestMethod.GET)
    @ResponseBody
    public void insert(@RequestParam("id") int id) {
        itemRepository.deleteById(id);
    }

}
