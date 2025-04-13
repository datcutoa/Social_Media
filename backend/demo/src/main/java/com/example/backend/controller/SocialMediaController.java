package com.example.backend.controller;

import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.service.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.Map;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.ArrayList;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import jakarta.persistence.EntityNotFoundException;

import java.io.IOException;
import java.io.File;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;
import java.util.Collections;
import java.time.format.DateTimeParseException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") 
public class SocialMediaController {
    UserRepository userRepository;
    @Autowired
    private CommentService commentService;

    // @Autowired
    // private EventParticipantService eventParticipantRepository;
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

    // @Autowired
    // private GroupMemberService groupMemberService;
    @Autowired
    private UserService userService;

    @Autowired
    private AdminService adminService;

    /*----------------------------- API LIÊN QUAN ĐẾN COMMENT -------------------------------*/
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
    public ResponseEntity<?> createComment(@RequestBody Comment commentRequest) {
        try {
            Post post = postService.findById(commentRequest.getPostId())
                    .orElseThrow(() -> new RuntimeException("Post not found"));
            
            User user = userService.findById(commentRequest.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Comment comment = new Comment(post, user, commentRequest.getContent());
            
            commentService.createComment(comment);
            
            // Trả về JSON khi thành công
            return ResponseEntity.ok(Map.of("message", "Comment added successfully!"));
        } catch (Exception e) {
            // Trả về JSON khi có lỗi
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error: " + e.getMessage()));
        }
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

    @GetMapping("/comment/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable Long postId) {
        List<Comment> comments = commentService.getCommentsByPostId(postId);
        if (comments.isEmpty()) {
            return ResponseEntity.notFound().build();  // Return 404 if no comments are found for this postId
        }
        return ResponseEntity.ok(comments);  // Return 200 OK with the list of comments
    }

    @GetMapping("/count/{postId}")
    public ResponseEntity<Long> countCommentsByPostId(@PathVariable Long postId) {
        long count = commentService.countCommentsByPostId(postId);
        return ResponseEntity.ok(count);
    }

    //eventparticipant
    // @GetMapping("/eventparticipant")
    // public List<EventParticipant> getAllEventParticipants() {
    //     return eventParticipantService.getAllEventParticipants();
    // }
    // @PostMapping("/eventparticipant")
    // public void createEventParticipant(@RequestBody EventParticipant eventParticipant) {
    //     eventParticipantService.createEventParticipant(eventParticipant);
    // }
    // @DeleteMapping("/eventparticipant/{id}")
    // public void deleteEventParticipant(@PathVariable Long id) {
    //     eventParticipantService.deleteEventParticipant(id);
    // }
    // Event
    @GetMapping("/event")
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/event/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Optional<Event> event = eventService.getEventById(id);
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
    
    /*----------------------------- API LIÊN QUAN ĐẾN FRIENDSHIP -------------------------------*/
    //Lấy danh sách tất cả các lời mời kết bạn đã gửi
    @PostMapping("/friendship/send-request")
    public ResponseEntity<?> sendFriendRequest(@RequestParam Long userId, @RequestParam Long friendId) {
        FriendShip friendShip = friendShipService.sendFriendRequest(userId, friendId);
        return ResponseEntity.ok("Friend request sent successfully!");
    }

    //Check trạng thái bạn bè
    @GetMapping("/friendship/status")
    public ResponseEntity<?> checkFriendStatus(
            @RequestParam Long userId,
            @RequestParam Long friendId) {
        FriendShip.Status status = friendShipService.checkFriendStatus(userId, friendId);
        if (status != null) {
            return ResponseEntity.ok(Map.of("status", status));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Không tìm thấy quan hệ bạn bè"));
    }

    @GetMapping("/friendship/pending/{userId}")
    public List<User> getPendingFriendRequests(@PathVariable Long userId) {
        return friendShipService.getPendingFriendRequests(userId);
    }

    //Lấy danh sách tất cả các lời mời kết bạn đã nhận
    @GetMapping("/friendship/received/{userId}")
    public ResponseEntity<List<User>> getReceivedFriendRequests(@PathVariable Long userId) {
        List<User> receivedRequests = friendShipService.getReceivedFriendRequests(userId);
        return ResponseEntity.ok(receivedRequests);
    }

    //Chấp nhận kết bạn
    @PutMapping("/friendship/accept")
    public ResponseEntity<String> acceptFriendRequest(@RequestParam Long userId, @RequestParam Long friendId) {
        boolean success = friendShipService.acceptFriendRequest(userId, friendId);
        if (success) {
            return ResponseEntity.ok("Lời mời kết bạn đã được chấp nhận.");
        } else {
            return ResponseEntity.ok("Không tìm thấy lời mời kết bạn.");
        }
    }

    //Danh sách bạn bè
    @GetMapping("/friendship/friends/{userId}")
    public ResponseEntity<List<User>> getFriendsByUser (@PathVariable Long userId) {
        List<User> friends = friendShipService.getFriendsByUser(userId);
        return ResponseEntity.ok(friends);
    }

    //Danh sách bạn bè của bạn bè
    @GetMapping("/friendship/friends-of-friends/{userId}")
    public ResponseEntity<List<User>> getFriendsOfFriends(@PathVariable Long userId) {
        List<User> friends = friendShipService.getFriendsByUser(userId);
        Set<User> friendsOfFriends = new HashSet<>();
        for (User friend : friends) {
            List<User> friendsOfFriend = friendShipService.getFriendsByUser(friend.getId());
            friendsOfFriends.addAll(friendsOfFriend);
        }
        return ResponseEntity.ok(new ArrayList<>(friendsOfFriends));
    }

    //Hủy kết bạn
    @PutMapping("/friendship/unfriend")
    public ResponseEntity<String> unfriend(@RequestParam Long userId, @RequestParam Long friendId) {
        boolean success = friendShipService.unfriend(userId, friendId);
        if (success) {
            return ResponseEntity.ok("Đã hủy kết bạn thành công!");
        } else {
            return ResponseEntity.badRequest().body("Không thể hủy kết bạn. Có thể hai người chưa là bạn bè!");
        }
    }

    /*----------------------------- API LIÊN QUAN ĐẾN LƯỢT LIKE -------------------------------*/
    // Like
    @GetMapping("/like")
    public List<Like> getAllLikes() {
        return likeService.getAllLikes();
    }

    //Lấy lượt like bằng id
    @GetMapping("/like/{id}")
    public ResponseEntity<Like> getLikeById(@PathVariable Long id) {
        Optional<Like> like = likeService.getLikeById(id);
        if (like.isPresent()) {
            return ResponseEntity.ok(like.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //Tạo lượt like
    @PostMapping("/like")
    public ResponseEntity<?> createLike(@RequestBody Like like) {
        likeService.createLike(like);
        return ResponseEntity.ok("Like add successfully!");
    }

    //Bỏ like
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

    //Đếm số lượt like của một bài post
    @GetMapping("/users/{userId}/posts/{postId}/likes/count")
    public ResponseEntity<Long> getLikeCountForUserPost(
            @PathVariable Long userId,
            @PathVariable Long postId) {
        Optional<Post> post = postService.getPostByIdAndUserId(postId, userId);
        if (post.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(0L); // Bài viết không tồn tại hoặc không thuộc user
        }
        long likeCount = likeService.getLikeCountByPostId(postId);
        return ResponseEntity.ok(likeCount);
    }

    //Like một bài post
    @PostMapping("/likes")
    public ResponseEntity<String> likePost(
            @RequestParam Long userId,
            @RequestParam Long postId) {
        boolean success = likeService.likePost(userId, postId);
        if (success) {
            return ResponseEntity.ok("Đã thích bài viết");
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Bạn đã thích bài viết này rồi");
        }
    }

    @GetMapping("/likes/check")
    public ResponseEntity<Boolean> checkIfUserLikedPost(
            @RequestParam Long userId,
            @RequestParam Long postId) {
        boolean hasLiked = likeService.hasUserLikedPost(userId, postId);
        return ResponseEntity.ok(hasLiked);
    }

    @GetMapping("/like/find")
    public ResponseEntity<Long> getLikeByUserAndPost(
            @RequestParam Long userId, @RequestParam Long postId) {
        Optional<Like> like = likeService.getLikeByUserAndPost(userId, postId);
        return like.map(l -> ResponseEntity.ok(l.getId())).orElseGet(() -> ResponseEntity.notFound().build());
    }

    //Danh sách số lượt like của bài post
    @GetMapping("like/post/{postId}/users")
    public ResponseEntity<List<User>> getUsersWhoLikedPost(@PathVariable Long postId) {
        Optional<Post> post = postService.getPostById(postId);
        if (post.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        List<User> users = likeService.getUsersWhoLikedPost(postId);
        return ResponseEntity.ok(users);
    }

    /*----------------------------- API LIÊN QUAN ĐẾN TIN NHẮN -------------------------------*/
    // Message
    @GetMapping("/message")
    public List<Message> getAllMessages() {
        return messageService.getAllMessages();
    }

    @GetMapping("/message/{id}")
    public ResponseEntity<Message> getMessageById(@PathVariable Long id) {
        Optional<Message> message = messageService.getMessageById(id);
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

    @PostMapping("/message/send")
    public ResponseEntity<?> sendMessage(@RequestBody Message message) {
        try {
            Message sentMessage = messageService.sendMessage(message);
            return ResponseEntity.ok(sentMessage);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sending message: " + e.getMessage());
        }
    }

    @GetMapping("/message/between")
    public ResponseEntity<List<Message>> fetchMessagesBetweenUsers(
            @RequestParam("userId1") Long userId1,
            @RequestParam("userId2") Long userId2) {
        try {
            List<Message> messages = messageService.getMessagesBetweenUsers(userId1, userId2);
            if (messages.isEmpty()) {
                return ResponseEntity.noContent().build(); // 204 No Content nếu không có tin nhắn
            }
            return ResponseEntity.ok(messages); // 200 OK
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // 400 Bad Request nếu tham số không hợp lệ
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // 500 Internal Server Error nếu có lỗi khác
        }
    }

    @GetMapping("/message/conversations")
    public ResponseEntity<List<Map<String, Object>>> fetchConversations(@RequestParam("userId") Long userId) {
        try {
            List<Map<String, Object>> conversations = messageService.getConversations(userId);
            if (conversations.isEmpty()) {
                return ResponseEntity.noContent().build(); // 204 No Content nếu không có cuộc hội thoại
            }
            return ResponseEntity.ok(conversations); // 200 OK với danh sách cuộc hội thoại
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // 400 Bad Request nếu userId không hợp lệ
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // 500 Internal Server Error nếu có lỗi khác
        }
    }

    // Notification
    @GetMapping("/notification")
    public List<Notification> getAllNotifications() {
        return notificationService.getAllNotifications();
    }

    @GetMapping("/notification/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        Optional<Notification> notification = notificationService.getNotificationById(id);
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

    /*-----------------------------API LIÊN QUAN ĐẾN BÀI Post-------------------------------*/
    @GetMapping("/post")
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/post/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        Optional<Post> post = postService.getPostById(id);
        if (post.isPresent()) {
            return ResponseEntity.ok(post.get()); // Trả về Post nếu có
        } else {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy
        }
    }

    @GetMapping("posts/user/{userId}")
    public List<Post> getPostsByUserId(@PathVariable Long userId) {
        return postService.getPostsByUserId(userId);
    }
    
    //Tạo bài post
    @PostMapping("/post")
    public ResponseEntity<?> createPost(
            @RequestPart("content") String content,
            @RequestPart("privacy") String privacy,
            @RequestPart("userId") String userId,
            @RequestPart(value = "media", required = false) MultipartFile media) {
        try {
            Post post = new Post();
            post.setContent(content);
            String privacyValue = privacy.toUpperCase();
            if (privacyValue.equals("PUBLIC")) {
                privacyValue = "CONG_KHAI";
            } else if (privacyValue.equals("FRIENDS")) {
                privacyValue = "BAN_BE";
            } else if (privacyValue.equals("PRIVATE")) {
                privacyValue = "RIENG_TU";
            }
            post.setPrivacy(Post.Privacy.valueOf(privacyValue));
            Long userIdLong = Long.parseLong(userId);
            Optional<User> userOptional = userService.getUserById(userIdLong);
            if (!userOptional.isPresent()) {
                return ResponseEntity.status(404).body("User not found");
            }
            post.setUser(userOptional.get());
            if (media != null && !media.isEmpty()) {
                String uploadDir = System.getProperty("user.dir") + "/../../frontend/public/uploads/post";
                Files.createDirectories(Paths.get(uploadDir));
                String fileName = System.currentTimeMillis() + "_" + media.getOriginalFilename();
                Path filePath = Paths.get(uploadDir, fileName);
                Files.write(filePath, media.getBytes());
                post.setMediaUrl(fileName);
            }
            postService.createPost(post);
            return ResponseEntity.ok("Post added successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating post: " + e.getMessage());
        }
    }

    @DeleteMapping("/post/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        Optional<Post> postOptional = postService.getPostById(id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            post.setStatus(0); // 0 là đã bị ẩn / xoá mềm
            postService.savePost(post);
            return ResponseEntity.ok("Post deleted (soft delete) successfully!");
        } else {
            return ResponseEntity.status(404).body("Post not found");
        }
    }


    @PutMapping("/post/{id}")
    public ResponseEntity<String> updatePost(@PathVariable Long id, @RequestBody Post newPost) {
        postService.updatePost(id, newPost);
        return ResponseEntity.ok("Post updated successfully!");
    }

    //Đếm số lượng bài post (admin)
    @GetMapping("/post/count")
    public ResponseEntity<Map<String, Long>> getPostCount() {
        long postCount = postService.getPostCount();
        Map<String, Long> response = new HashMap<>();
        response.put("postCount", postCount);
        return ResponseEntity.ok(response);
    }

    //Cập nhật quyền của bài post
    @PutMapping("/post/{postId}/privacy")
    public ResponseEntity<String> updatePostPrivacy(
            @PathVariable Long postId,
            @RequestParam String privacy) {
        Post.Privacy privacyEnum;
        try {
            privacyEnum = Post.Privacy.valueOf(privacy);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Quyền riêng tư không hợp lệ");
        }

        // Gọi service chỉ với postId và privacy
        boolean success = postService.updatePrivacy(postId, privacyEnum);
        if (success) {
            return ResponseEntity.ok("Cập nhật quyền riêng tư thành công!");
        } else {
            return ResponseEntity.badRequest().body("Không thể cập nhật quyền riêng tư.");
        }
    }

    // Group
    @GetMapping("/group")
    public List<GroupEntity> getAllGroupEntities() {
        return groupEntityService.getAllGroupEntities();
    }

    @GetMapping("/group/{id}")
    public ResponseEntity<GroupEntity> getGroupEntityById(@PathVariable Long id) {
        Optional<GroupEntity> groupEntity = groupEntityService.getGroupEntityById(id);
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
    // @GetMapping("/groupmember")
    // public List<GroupMember> getAllGroupMembers() {
    //     return groupMemberService.getAllGroupMembers();
    // }
    // @GetMapping("/groupmember/{id}")
    // public ResponseEntity<GroupMember> getGroupMemberById(@PathVariable Long id) {
    //     Optional<GroupMember> groupMember=groupMemberService.getGroupMemberById(id);
    //     if (groupMember.isPresent()) {
    //         return ResponseEntity.ok(groupMember.get()); // Trả về Post nếu có
    //     } else {
    //         return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy
    //     }
    // }
    // @PostMapping("/groupmember")
    // public ResponseEntity<?> createGroupMember(@RequestBody GroupMember groupMember) {
    //     groupMemberService.createGroupMember(groupMember);
    //     return ResponseEntity.ok("GroupMember add successfully!");
    // }
    // @DeleteMapping("/groupmember/{id}")
    // public ResponseEntity<?> deleteGroupMember(@PathVariable Long id) {
    //     groupMemberService.deleteGroupMember(id);
    //     return ResponseEntity.ok("GroupMember deleted successfully!");
    // }
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
    /*----------------------------- API LIÊN QUAN ĐẾN USER -------------------------------*/
    @GetMapping("/user")
    public List<User> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return users;
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
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

    //Thay đổi thông tin cá nhân của người dùng
    @PutMapping("/user/{id}")
    public ResponseEntity<Map<String, String>> updateUser(@PathVariable Long id, @RequestBody User newUser) {
        userService.updateUser(id, newUser);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User updated successfully!");
        return ResponseEntity.ok(response);
    }

    //Thay đổi ảnh đại diện của người dùng
    @PutMapping("/user/{id}/avatar")
    public ResponseEntity<?> updateAvatar(
            @PathVariable Long id,
            @RequestParam("avatar") MultipartFile avatar) {
        try {
            Optional<User> userOptional = userService.getUserById(id);
            if (!userOptional.isPresent()) {
                return ResponseEntity.status(404).body("User not found");
            }

            User user = userOptional.get();

            // Chỉ xóa ảnh cũ nếu khác "default_avt.jpg"
            if (user.getProfilePicture() != null
                    && !user.getProfilePicture().isEmpty()
                    && !user.getProfilePicture().equals("default_avt.jpg")) {

                String oldAvatarPath = System.getProperty("user.dir") + "/../../frontend/public/uploads/avatar/" + user.getProfilePicture();
                File oldAvatarFile = new File(oldAvatarPath);
                if (oldAvatarFile.exists()) {
                    oldAvatarFile.delete();
                }
            }

            String uploadDir = System.getProperty("user.dir") + "/../../frontend/public/uploads/avatar";
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            String newAvatarFileName = System.currentTimeMillis() + "_" + avatar.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, newAvatarFileName);
            Files.write(filePath, avatar.getBytes());

            user.setProfilePicture(newAvatarFileName);
            userService.updateUser(id, user);

            Map<String, String> response = new HashMap<>();
            response.put("profilePicture", newAvatarFileName);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating avatar: " + e.getMessage());
        }
    }

    //Thay đổi ảnh bìa của người dùng
    @PutMapping("/user/{id}/coverphoto")
    public ResponseEntity<?> updateCoverPhoto(
            @PathVariable Long id,
            @RequestParam("coverImage") MultipartFile coverImage) { // Thay "cover" thành "coverImage"
        try {
            Optional<User> userOptional = userService.getUserById(id);
            if (!userOptional.isPresent()) {
                return ResponseEntity.status(404).body("User not found");
            }

            User user = userOptional.get();

            if (user.getCoverPhoto() != null 
                && !user.getCoverPhoto().isEmpty()
                && !user.getCoverPhoto().equals("default_cover.jpg")) {
                String oldCoverPath = System.getProperty("user.dir") + "/../../frontend/public/uploads/cover/" + user.getCoverPhoto();
                File oldCoverFile = new File(oldCoverPath);
                if (oldCoverFile.exists()) {
                    oldCoverFile.delete();
                }
            }

            String uploadDir = System.getProperty("user.dir") + "/../../frontend/public/uploads/cover";
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            String newCoverFileName = System.currentTimeMillis() + "_" + coverImage.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, newCoverFileName);
            Files.write(filePath, coverImage.getBytes());

            user.setCoverPhoto(newCoverFileName);
            userService.updateUser(id, user);

            Map<String, String> response = new HashMap<>();
            response.put("coverPhoto", newCoverFileName);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating cover photo: " + e.getMessage());
        }
    }

    //Quản lý người dùng đếm số lượng người dùng của hệ thống(admin)
    @GetMapping("/user/count")
    public ResponseEntity<Map<String, Long>> getUserCount() {
        long userCount = userService.getUserCount();
        Map<String, Long> response = new HashMap<>();
        response.put("userCount", userCount);
        return ResponseEntity.ok(response);
    }

    //Quản lý người dùng thay đổi trạng thái(admin)
    @PutMapping("/user/{id}/status")
    public ResponseEntity<Map<String, String>> toggleUserStatus(@PathVariable Long id) {
        try {
            // Kiểm tra xem người dùng có tồn tại không
            Optional<User> userOptional = userService.getUserById(id);
            if (!userOptional.isPresent()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "User not found");
                return ResponseEntity.status(404).body(response);
            }

            // Lấy người dùng và đảo ngược trạng thái
            User user = userOptional.get();
            int currentStatus = user.getStatus();
            int newStatus = (currentStatus == 1) ? 0 : 1; // Đảo ngược: 1 -> 0, 0 -> 1
            user.setStatus(newStatus);
            userService.updateUserStatus(id, newStatus);

            // Trả về phản hồi thành công
            Map<String, String> response = new HashMap<>();
            response.put("message", "User status updated successfully");
            response.put("newStatus", newStatus == 1 ? "Active" : "Inactive");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error updating user status: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    //Đổi mật khẩu của người dùng
    @PutMapping("/user/{id}/password")
    public ResponseEntity<Map<String, String>> changePassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> passwordData) {
        try {
            String oldPassword = passwordData.get("oldPassword");
            String newPassword = passwordData.get("newPassword");

            // Gọi service để xử lý đổi mật khẩu
            userService.changePassword(id, oldPassword, newPassword);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Đổi mật khẩu thành công");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message",e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    //Tìm kiếm nội dung
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam("query") String query) {
        List<User> users = userService.searchUsersByName(query);
        return ResponseEntity.ok(users);
    }

    //Login user
    @PostMapping("/user/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOptional = userService.findByUsernameAndPassword(request.getUsername(), request.getPassword());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getStatus() == 0) {
                return ResponseEntity.ok("Tài khoản của bạn đã bị khóa.Vui lòng liên hệ quản trị viên để biết thêm chi tiết.");
            }
            return ResponseEntity.ok(new User(user.getId(), user.getUsername(),user.getEmail()));
        } else {
            return ResponseEntity.ok("Sai tài khoản hoặc mật khẩu");
        }
    }

    //Login admin
    @PostMapping("/admin/login")
    public ResponseEntity<?> loginAdmin(@RequestBody Admin adminRequest) {
        String username = adminRequest.getUsername();
        String password = adminRequest.getPassword();

        if (username == null || password == null) {
            return ResponseEntity.status(400).body("Tên đăng nhập hoặc mật khẩu không được để trống!");
        }

        System.out.println("Received username: " + username);
        System.out.println("Received password: " + password);
        Admin admin = adminService.login(username, password);
        if (admin != null) {
            return ResponseEntity.ok("Đăng nhập thành công");
        } else {
            return ResponseEntity.status(401).body("Sai tên đăng nhập hoặc mật khẩu!");
        }
    }
    
}