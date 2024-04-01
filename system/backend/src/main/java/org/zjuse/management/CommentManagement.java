package org.zjuse.management;

import org.zjuse.entity.Comment;
import org.zjuse.entity.Order.Type;
import org.zjuse.utils.ApiResult;

public interface CommentManagement {

    /**
     * query comments according the given conditions(sorted by id)
     * 
     * @param customerId
     * @param serviceId
     * @param type
     * @return status; the list of comments will be returned in payload
     */
    ApiResult queryComment(Long customerId, Long serviceId, Type type);

    /**
     * add a new comment
     * 
     * @param comment
     * @return status; the id of the comment will be returned in comment
     */
    ApiResult addComment(Comment comment);

    /**
     * update a comment
     * (id cannot be changed)
     * 
     * @param id
     * @param score
     * @param content
     * @return status
     */
    ApiResult updateComment(Long id, Double score, String content);

    /**
     * delete a comment
     * 
     * @param id the id of the comment to be deleted
     * @return status
     */
    ApiResult deleteComment(Long id);

    /**
     * reset comment table
     * (all data will be deleted)
     * 
     * @return status
     */
    ApiResult resetComment();
}
