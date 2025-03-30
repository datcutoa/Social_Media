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
    private EventParticipantService eventParticipantService;
    
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
    private NotificationService notificationService;

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

        // API: User tham gia sự kiện
        @PostMapping("/eventParticipant/join/{eventId}/{userId}")
        public ResponseEntity<String> joinEvent(@PathVariable Long eventId, @PathVariable Long userId,
                                                @RequestParam(defaultValue = "THAM_GIA") String status) {
            try {
                EventParticipant.Status st = EventParticipant.Status.valueOf(status.toUpperCase()); // Chuyển thành chữ in hoa để tránh lỗi
                eventParticipantService.joinEvent(eventId, userId, st);
                return ResponseEntity.ok("Tham gia sự kiện thành công");
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Trạng thái không hợp lệ: " + status);
            }
        }
        
        
        // API: Lấy danh sách user tham gia sự kiện
        @GetMapping("/eventParticipant/event/{eventId}")
        public ResponseEntity<List<User>> getParticipants(@PathVariable Long eventId) {
            List<User> participants = eventParticipantService.getParticipantsByEventId(eventId);
            return ResponseEntity.ok(participants);
        }
        
        // API: Lấy danh sách sự kiện mà một user tham gia
        @GetMapping("/eventParticipant/user/{userId}")
        public ResponseEntity<?> getEventsByUser(@PathVariable Long userId) {
            return ResponseEntity.ok(eventParticipantService.getEventsByUserId(userId));
        }
        
        // API: User rời khỏi sự kiện
        @DeleteMapping("/eventParticipant/leave/{eventId}/{userId}")
        public ResponseEntity<String> leaveEvent(@PathVariable Long eventId, @PathVariable Long userId) {
            eventParticipantService.leaveEvent(eventId, userId);
            return ResponseEntity.ok("Rời khỏi sự kiện thành công");
        }
        
        // API: Cập nhật trạng thái tham gia (ví dụ: chuyển từ Quan tâm sang Tham gia)
        @PutMapping("eventParticipant//update-status/{eventId}/{userId}")
        public ResponseEntity<String> updateStatus(@PathVariable Long eventId, @PathVariable Long userId,
                                                   @RequestParam String status) {
            EventParticipant.Status st = EventParticipant.Status.valueOf(status);
            eventParticipantService.updateParticipantStatus(eventId, userId, st);
            return ResponseEntity.ok("Cập nhật trạng thái thành công");
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
    
    // API: Theo dõi user
    @PostMapping("/follow/{followerId}/{followingId}")
    public ResponseEntity<String> followUser(@PathVariable Long followerId, @PathVariable Long followingId) {
        followService.followUser(followerId, followingId);
        return ResponseEntity.ok("Theo dõi thành công");
    }
    
    // API: Hủy theo dõi
    @DeleteMapping("/unfollow/{followerId}/{followingId}")
    public ResponseEntity<String> unfollowUser(@PathVariable Long followerId, @PathVariable Long followingId) {
        followService.unfollowUser(followerId, followingId);
        return ResponseEntity.ok("Hủy theo dõi thành công");
    }
    
    // API: Lấy danh sách user mà một user đang theo dõi
    @GetMapping("/following/{userId}")
    public ResponseEntity<List<User>> getFollowing(@PathVariable Long userId) {
        return ResponseEntity.ok(followService.getFollowing(userId));
    }
    
    // API: Lấy danh sách người theo dõi của một user
    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<User>> getFollowers(@PathVariable Long userId) {
        return ResponseEntity.ok(followService.getFollowers(userId));
    }
    

    // FriendShip
    // ✅ Gửi lời mời kết bạn
    @PostMapping("/send/{userId}/{friendId}")
    public ResponseEntity<String> sendFriendRequest(@PathVariable Long userId, @PathVariable Long friendId) {
        friendShipService.sendFriendRequest(userId, friendId);
        return ResponseEntity.ok("Lời mời kết bạn đã được gửi!");
    }

    // ✅ Lấy danh sách bạn bè
    @GetMapping("/friends/{userId}")
    public ResponseEntity<List<User>> getFriends(@PathVariable Long userId) {
        return ResponseEntity.ok(friendShipService.getFriends(userId));
    }

    // ✅ Lấy danh sách lời mời kết bạn
    @GetMapping("/requests/{userId}")
    public ResponseEntity<List<FriendShip>> getPendingRequests(@PathVariable Long userId) {
        return ResponseEntity.ok(friendShipService.getPendingRequests(userId));
    }

    // ✅ Chấp nhận lời mời kết bạn
    @PutMapping("/accept/{userId}/{friendId}")
    public ResponseEntity<String> acceptFriendRequest(@PathVariable Long userId, @PathVariable Long friendId) {
        friendShipService.acceptFriendRequest(userId, friendId);
        return ResponseEntity.ok("Đã chấp nhận lời mời kết bạn!");
    }

    // ✅ Từ chối lời mời kết bạn
    @PutMapping("/reject/{userId}/{friendId}")
    public ResponseEntity<String> rejectFriendRequest(@PathVariable Long userId, @PathVariable Long friendId) {
        friendShipService.rejectFriendRequest(userId, friendId);
        return ResponseEntity.ok("Đã từ chối lời mời kết bạn!");
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
        return notificationService.getAllNotifications();
    }

    @GetMapping("/notification/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        Optional<Notification> notification=notificationService.getNotificationById(id);
        if (notification.isPresent()) {
            return ResponseEntity.ok(notification.get()); // Trả về Post nếu có
        } else {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy
        }
        
    }

    @PostMapping("/notification")
    public ResponseEntity<?> createNotification(@RequestBody Notification notification) {
        notificationService.createNotification(notification);
        return ResponseEntity.ok("Notification add successfully!");
    }

    @DeleteMapping("/notification/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok("Notification deleted successfully!");
    }

    @PutMapping("/notification/{id}")
    public ResponseEntity<String> updateNotification(@PathVariable Long id, @RequestBody Notification newNotification) {
        notificationService.updateNotification(id, newNotification);
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

        // API: Thêm thành viên vào group
        @PostMapping("/add/{groupId}/{userId}")
        public ResponseEntity<String> addMember(@PathVariable Long groupId, @PathVariable Long userId,
                                                  @RequestParam(defaultValue = "THANH_VIEN") String role) {
            GroupMember.Role r = GroupMember.Role.valueOf(role);
            groupMemberService.addMemberToGroup(groupId, userId, r);
            return ResponseEntity.ok("Thành viên được thêm vào group thành công");
        }
        
        // API: Lấy danh sách thành viên của group
        @GetMapping("/group/{groupId}")
        public ResponseEntity<List<User>> getMembersByGroup(@PathVariable Long groupId) {
            return ResponseEntity.ok(groupMemberService.getMembersByGroupId(groupId));
        }
        
        // API: Lấy danh sách group mà user tham gia
        @GetMapping("/user/{userId}")
        public ResponseEntity<List<GroupEntity>> getGroupsByUser(@PathVariable Long userId) {
            return ResponseEntity.ok(groupMemberService.getGroupsByUserId(userId));
        }
        
        // API: Xóa thành viên khỏi group
        @DeleteMapping("/remove/{groupId}/{userId}")
        public ResponseEntity<String> removeMember(@PathVariable Long groupId, @PathVariable Long userId) {
            groupMemberService.removeMemberFromGroup(groupId, userId);
            return ResponseEntity.ok("Thành viên đã bị xóa khỏi group");
        }
        
        // API: Cập nhật vai trò của thành viên trong group
        @PutMapping("/update-role/{groupId}/{userId}")
        public ResponseEntity<String> updateMemberRole(@PathVariable Long groupId, @PathVariable Long userId,
                                                       @RequestParam String role) {
            GroupMember.Role r = GroupMember.Role.valueOf(role);
            groupMemberService.updateMemberRole(groupId, userId, r);
            return ResponseEntity.ok("Vai trò của thành viên đã được cập nhật");
        }

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
