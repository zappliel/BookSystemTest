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
import org.zjuse.entity.Comment;
import org.zjuse.entity.Order.Type;
import org.zjuse.management.CommentManagement;
import org.zjuse.utils.ApiResult;

import lombok.extern.slf4j.Slf4j;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/comment")
@Slf4j
public class CommentWebService {

    @Autowired
    private CommentManagement commentManagement;

    /**
     * Query comment by conditions
     * 
     * @param customerId
     * @param serviceId
     * @param type
     * @return List<Comment>
     */
    @GetMapping("/query")
    public List<Comment> queryComment(@RequestParam(value = "customerId", required = false) Long customerId,
            @RequestParam(value = "serviceId", required = false) Long serviceId,
            @RequestParam(value = "type", required = false) Type type) {
        ApiResult result = commentManagement.queryComment(customerId, serviceId, type);
        if (!result.ok) {
            log.warn("Failed to query comment, reason: " + result.message);
            return null;
        }
        return (List<Comment>) result.payload;
    }

    /**
     * Add a comment
     * 
     * @param customerId
     * @param serviceId
     * @param type
     * @param score
     * @param content
     * @return HttpStatus
     */
    @PostMapping("/add")
    public HttpStatus addComment(@RequestParam(value = "customerId", required = true) Long customerId,
            @RequestParam(value = "serviceId", required = true) Long serviceId,
            @RequestParam(value = "type", required = true) Type type,
            @RequestParam(value = "score", required = true) Double score,
            @RequestParam(value = "content", required = true) String content) {
        Comment comment = new Comment(null, customerId, serviceId, type, score, content);
        ApiResult result = commentManagement.addComment(comment);
        if (!result.ok) {
            log.warn("Failed to add comment, reason: " + result.message);
            return HttpStatus.BAD_REQUEST;
        }
        return HttpStatus.OK;
    }

    /**
     * Update a comment
     * 
     * @param id
     * @param customerId
     * @param serviceId
     * @param type
     * @param score
     * @param content
     * @return HttpStatus
     */
    @PutMapping("/update")
    public HttpStatus updateComment(@RequestParam(value = "id", required = true) Long id,
            @RequestParam(value = "score", required = false) Double score,
            @RequestParam(value = "content", required = false) String content) {
        ApiResult result = commentManagement.updateComment(id, score, content);
        if (!result.ok) {
            log.warn("Failed to update comment, reason: " + result.message);
            return HttpStatus.BAD_REQUEST;
        }
        return HttpStatus.OK;
    }

    /**
     * Delete a comment
     * 
     * @param id
     * @return HttpStatus
     */
    @DeleteMapping("/delete")
    public HttpStatus deleteComment(@RequestParam(value = "id", required = true) Long id) {
        ApiResult result = commentManagement.deleteComment(id);
        if (!result.ok) {
            log.warn("Failed to delete comment, reason: " + result.message);
            return HttpStatus.BAD_REQUEST;
        }
        return HttpStatus.OK;
    }
}
