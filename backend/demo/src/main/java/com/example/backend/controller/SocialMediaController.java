package com.example.backend.controller;

import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.service.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api")
public class SocialMediaController {

    @Autowired
    private CommentService commentService;
    
    @Autowired
    private EventParticipantService eventParticipantRepository;
    
    @Autowired
    private EventService eventService;

    @Autowired
    private FollowService followService;

    @Autowired
    private FriendShipService friendShipService;

    @Autowired
    private LikeService likeService;

    @Autowired
    private MessageService messageService;

    @Autowired
    private NotificationServie notificationServie;

    @Autowired
    private PostService postService;

    @Autowired
    private GroupEntityService groupEntityService;

    @Autowired
    private GroupMemberService groupMemberService;

    @Autowired
    private UserService userService;



    //comment
    @GetMapping("/comment")
    public List<Comment> getAllComments() {
        return commentService.getAllComments();
    }

    @GetMapping("/comment/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable Long id) {
        Optional<Comment> comment=commentService.getCommentById(id);
        if (comment.isPresent()) {
            return ResponseEntity.ok(comment.get()); // Trả về Post nếu có
        } else {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy
        }
        
    }

    @PostMapping("/comment")
    public ResponseEntity<?> createComment(@RequestBody Comment comment) {
        commentService.createComment(comment);
        return ResponseEntity.ok("Comment add successfully!");
    }

    @DeleteMapping("/comment/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok("Comment deleted successfully!");
    }

    @PutMapping("/comment/{id}")
    public ResponseEntity<String> updateComment(@PathVariable Long id, @RequestBody Comment newComment) {
        commentService.updateComment(id, newComment);
        return ResponseEntity.ok("Comment updated successfully!");
    }


    //eventparticipant
    @GetMapping("/eventparticipant")
    public List<EventParticipant> getAllEventParticipants() {
        return eventParticipantService.getAllEventParticipants();
    }

    @PostMapping("/eventparticipant")
    public void createEventParticipant(@RequestBody EventParticipant eventParticipant) {
        eventParticipantService.createEventParticipant(eventParticipant);
    }

    @DeleteMapping("/eventparticipant/{id}")
    public void deleteEventParticipant(@PathVariable Long id) {
        eventParticipantService.deleteEventParticipant(id);
    }
    


    // Event
    @GetMapping("/event")
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/event/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Optional<Event> event=eventService.getEventById(id);
        if (event.isPresent()) {
            return ResponseEntity.ok(event.get()); // Trả về Post nếu có
        } else {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy
        }
        
    }

    @PostMapping("/event")
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        eventService.createEvent(event);
        return ResponseEntity.ok("Event add successfully!");
    }

    @DeleteMapping("/event/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok("Event deleted successfully!");
    }

    @PutMapping("/event/{id}")
    public ResponseEntity<String> updateEvent(@PathVariable Long id, @RequestBody Event newEvent) {
        eventService.updateEvent(id, newEvent);
        return ResponseEntity.ok("Event updated successfully!");
    }

    // Follow
    @GetMapping("/follow")
    public List<Follow> getAllFollows() {
        return followService.getAllFollows();
    }

    @GetMapping("/follow/{id}")
    public ResponseEntity<Follow> getFollowById(@PathVariable Long id) {
        Optional<Follow> follow=followService.getFollowById(id);
        if (follow.isPresent()) {
            return ResponseEntity.ok(follow.get()); // Trả về Post nếu có
        } else {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy
        }
        
    }

    @PostMapping("/follow")
    public ResponseEntity<?> createFollow(@RequestBody Follow follow) {
        followService.createFollow(follow);
        return ResponseEntity.ok("Follow add successfully!");
    }

    @DeleteMapping("/follow/{id}")
    public ResponseEntity<?> deleteFollow(@PathVariable Long id) {
        followService.deleteFollow(id);
        return ResponseEntity.ok("Follow deleted successfully!");
    }

    @PutMapping("/follow/{id}")
    public ResponseEntity<String> updateFollow(@PathVariable Long id, @RequestBody Follow newFollow) {
        followService.updateFollow(id, newFollow);
        return ResponseEntity.ok("Follow updated successfully!");
    }
    

    // FriendShip
    @GetMapping("/friendship")
    public List<FriendShip> getAllFriendShips() {
        return friendShipService.getAllFriendShips();
    }

    @GetMapping("/friendship/{id}")
    public ResponseEntity<FriendShip> getFriendShipById(@PathVariable Long id) {
        Optional<FriendShip> friendShip=friendShipService.getFriendShipById(id);
        if (friendShip.isPresent()) {
            return ResponseEntity.ok(friendShip.get()); // Trả về Post nếu có
        } else {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy
        }
        
    }

    @PostMapping("/friendship")
    public ResponseEntity<?> createFriendShip(@RequestBody FriendShip friendShip) {
        friendShipService.createFriendShip(friendShip);
        return ResponseEntity.ok("FriendShip add successfully!");
    }

    @DeleteMapping("/friendship/{id}")
    public ResponseEntity<?> deleteFriendShip(@PathVariable Long id) {
        friendShipService.deleteFriendShip(id);
        return ResponseEntity.ok("FriendShip deleted successfully!");
    }

    @PutMapping("/friendship/{id}")
    public ResponseEntity<String> updateFriendShip(@PathVariable Long id, @RequestBody FriendShip newFriendShip) {
        friendShipService.updateFriendShip(id, newFriendShip);
        return ResponseEntity.ok("FriendShip updated successfully!");
    }

    // Like
    @GetMapping("/like")
    public List<Like> getAllLikes() {
        return likeService.getAllLikes();
    }

    @GetMapping("/like/{id}")
    public ResponseEntity<Like> getLikeById(@PathVariable Long id) {
        Optional<Like> like=likeService.getLikeById(id);
        if (like.isPresent()) {
            return ResponseEntity.ok(like.get()); // Trả về Post nếu có
        } else {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy
        }
        
    }

    @PostMapping("/like")
    public ResponseEntity<?> createLike(@RequestBody Like like) {
        likeService.createLike(like);
        return ResponseEntity.ok("Like add successfully!");
    }

    @DeleteMapping("/like/{id}")
    public ResponseEntity<?> deleteLike(@PathVariable Long id) {
        likeService.deleteLike(id);
        return ResponseEntity.ok("Like deleted successfully!");
    }

    @PutMapping("/like/{id}")
    public ResponseEntity<String> updateLike(@PathVariable Long id, @RequestBody Like newLike) {
        likeService.updateLike(id, newLike);
        return ResponseEntity.ok("Like updated successfully!");
    }


    // Message
    @GetMapping("/message")
    public List<Message> getAllMessages() {
        return messageService.getAllMessages();
    }

    @GetMapping("/message/{id}")
    public ResponseEntity<Message> getMessageById(@PathVariable Long id) {
        Optional<Message> message=messageService.getMessageById(id);
        if (message.isPresent()) {
            return ResponseEntity.ok(message.get()); // Trả về Post nếu có
        } else {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy
        }
        
    }

    @PostMapping("/message")
    public ResponseEntity<?> createMessage(@RequestBody Message message) {
        messageService.createMessage(message);
        return ResponseEntity.ok("Message add successfully!");
    }

    @DeleteMapping("/message/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long id) {
        messageService.deleteMessage(id);
        return ResponseEntity.ok("Message deleted successfully!");
    }

    @PutMapping("/message/{id}")
    public ResponseEntity<String> updateMessage(@PathVariable Long id, @RequestBody Message newMessage) {
        messageService.updateMessage(id, newMessage);
        return ResponseEntity.ok("Message updated successfully!");
    }
    

    // Notification
    @GetMapping("/notification")
    public List<Notification> getAllNotifications() {
        return notificationServie.getAllNotifications();
    }

    @GetMapping("/notification/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        Optional<Notification> notification=notificationServie.getNotificationById(id);
        if (notification.isPresent()) {
            return ResponseEntity.ok(notification.get()); // Trả về Post nếu có
        } else {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy
        }
        
    }

    @PostMapping("/notification")
    public ResponseEntity<?> createNotification(@RequestBody Notification notification) {
        notificationServie.createNotification(notification);
        return ResponseEntity.ok("Notification add successfully!");
    }

    @DeleteMapping("/notification/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        notificationServie.deleteNotification(id);
        return ResponseEntity.ok("Notification deleted successfully!");
    }

    @PutMapping("/notification/{id}")
    public ResponseEntity<String> updateNotification(@PathVariable Long id, @RequestBody Notification newNotification) {
        notificationServie.updateNotification(id, newNotification);
        return ResponseEntity.ok("Notification updated successfully!");
    }

    // Post
    @GetMapping("/post")
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/post/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        Optional<Post> post=postService.getPostById(id);
        if (post.isPresent()) {
            return ResponseEntity.ok(post.get()); // Trả về Post nếu có
        } else {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy
        }
        
    }

    @PostMapping("/post")
    public ResponseEntity<?> createPost(@RequestBody Post post) {
        postService.createPost(post);
        return ResponseEntity.ok("Post add successfully!");
    }

    @DeleteMapping("/post/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok("Post deleted successfully!");
    }

    @PutMapping("/post/{id}")
    public ResponseEntity<String> updatePost(@PathVariable Long id, @RequestBody Post newPost) {
        postService.updatePost(id, newPost);
        return ResponseEntity.ok("Post updated successfully!");
    }

    // @PutMapping("/post/{id}/{column}/{value}")
    // public ResponseEntity<String> updatePostColumn(@PathVariable Long id, @PathVariable String column, @PathVariable String value) {
    //     postService.updatePostColumn(column, value, id);
    //     return ResponseEntity.ok("Post updated successfully!");
    // }

    // Group
    @GetMapping("/group")
    public List<GroupEntity> getAllGroupEntities() {
        return groupEntityService.getAllGroupEntities();
    }

    @GetMapping("/group/{id}")
    public ResponseEntity<GroupEntity> getGroupEntityById(@PathVariable Long id) {
        Optional<GroupEntity> groupEntity=groupEntityService.getGroupEntityById(id);
        if (groupEntity.isPresent()) {
            return ResponseEntity.ok(groupEntity.get()); // Trả về Post nếu có
        } else {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy
        }
        
    }

    @PostMapping("/group")
    public ResponseEntity<?> createGroupEntity(@RequestBody GroupEntity groupEntity) {
        groupEntityService.createGroupEntity(groupEntity);
        return ResponseEntity.ok("GroupEntity add successfully!");
    }

    @DeleteMapping("/group/{id}")
    public ResponseEntity<?> deleteGroupEntity(@PathVariable Long id) {
        groupEntityService.deleteGroupEntity(id);
        return ResponseEntity.ok("GroupEntity deleted successfully!");
    }

    @PutMapping("/group/{id}")
    public ResponseEntity<String> updateGroupEntity(@PathVariable Long id, @RequestBody GroupEntity newGroupEntity) {
        groupEntityService.updateGroupEntity(id, newGroupEntity);
        return ResponseEntity.ok("GroupEntity updated successfully!");
    }

    // @PutMapping("/group/{id}/{column}/{value}")
    // public ResponseEntity<String> updateGroupEntityColumn(@PathVariable Long id, @PathVariable String column, @PathVariable String value) {
    //     groupEntityService.updateGroupColumn(column, value, id);
    //     return ResponseEntity.ok("GroupEntity updated successfully!");
    // }

    // GroupMember
    @GetMapping("/groupmember")
    public List<GroupMember> getAllGroupMembers() {
        return groupMemberService.getAllGroupMembers();
    }

    @GetMapping("/groupmember/{id}")
    public ResponseEntity<GroupMember> getGroupMemberById(@PathVariable Long id) {
        Optional<GroupMember> groupMember=groupMemberService.getGroupMemberById(id);
        if (groupMember.isPresent()) {
            return ResponseEntity.ok(groupMember.get()); // Trả về Post nếu có
        } else {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy
        }
        
    }

    @PostMapping("/groupmember")
    public ResponseEntity<?> createGroupMember(@RequestBody GroupMember groupMember) {
        groupMemberService.createGroupMember(groupMember);
        return ResponseEntity.ok("GroupMember add successfully!");
    }

    @DeleteMapping("/groupmember/{id}")
    public ResponseEntity<?> deleteGroupMember(@PathVariable Long id) {
        groupMemberService.deleteGroupMember(id);
        return ResponseEntity.ok("GroupMember deleted successfully!");
    }

    // @PutMapping("/groupmember/{id}")
    // public ResponseEntity<String> updateGroupMember(@PathVariable Long id, @RequestBody GroupMember newGroupMember) {
    //     groupMemberService.updateGroupMember(id, newGroupMember);
    //     return ResponseEntity.ok("GroupMember updated successfully!");
    // }

    // @PutMapping("/groupmember/{id}/{column}/{value}")
    // public ResponseEntity<String> updateGroupMemberColumn(@PathVariable Long id, @PathVariable String column, @PathVariable String value) {
    //     groupMemberService.updateGroupMemberColumn(column, value, id);
    //     return ResponseEntity.ok("GroupMember updated successfully!");
    // }

    // User
    @GetMapping("/user")
    public List<User> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return users;
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user=userService.getUserById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get()); // Trả về Post nếu có
        } else {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy
        }
        
    }

    @PostMapping("/user")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        userService.createUser(user);
        return ResponseEntity.ok("User add successfully!");
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully!");
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Long id, @RequestBody User newUser) {
        userService.updateUser(id, newUser);
        return ResponseEntity.ok("User updated successfully!");
    }

    // @PutMapping("/user/{id}/{column}/{value}")
    // public ResponseEntity<String> updateUserColumn(@PathVariable Long id, @PathVariable String column, @PathVariable String value) {
    //     userService.updateUserColumn(column, value, id);
    //     return ResponseEntity.ok("User updated successfully!");
    // }
    

}
