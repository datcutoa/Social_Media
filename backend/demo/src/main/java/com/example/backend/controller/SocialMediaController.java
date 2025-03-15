package com.example.backend.controller;

import com.example.backend.model.*;
import com.example.backend.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api")
public class SocialMediaController {

    @Autowired
    private CommentRepository CommentRepository;
    
    @Autowired
    private EventParticipantRepository EventParticipantRepository;
    
    @Autowired
    private EventRepository EventRepository;

    @Autowired
    private FollowRepository FollowRepository;

    @Autowired
    private FriendShipRepository FriendShipRepository;

    @Autowired
    private LikeRepository LikeRepository;

    @Autowired
    private MessageRepository MessageRepository;

    @Autowired
    private NotificationRepository NotificationRepository;

    @Autowired
    private PostRepository PostRepository;

    @Autowired
    private GroupRepository GroupRepository;

    @Autowired
    private GroupMemberRepository GroupMemberRepository;

    @Autowired
    private UserRepository UserRepository;


    //comment
    @GetMapping("/comment")
    public List<Comment> getAllComments() {
        return CommentRepository.findAll();
    }

    @PostMapping("/comment")
    public Comment createComment(@RequestBody Comment comment) {
        return CommentRepository.save(comment);
    }

    @DeleteMapping("/comment/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        return CommentRepository.findById(id).map(comment -> {
            CommentRepository.delete(comment);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/comment/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable Long id, @RequestBody Comment newComment) {
        return CommentRepository.findById(id).map(comment -> {
            // comment.setContent(newComment.getContent()); // Giả sử Comment có thuộc tính content
            return ResponseEntity.ok(CommentRepository.save(comment));
        }).orElse(ResponseEntity.notFound().build());
    }


    //eventparticipant
    @GetMapping("/eventparticipant")
    public List<EventParticipant> getAllEventParticipants() {
        return EventParticipantRepository.findAll();
    }

    @PostMapping("/eventparticipant")
    public EventParticipant createEventParticipant(@RequestBody EventParticipant eventparticipant) {
        return EventParticipantRepository.save(eventparticipant);
    }

    @DeleteMapping("/eventparticipant/{id}")
    public ResponseEntity<?> deleteEventParticipant(@PathVariable Long id) {
        return EventParticipantRepository.findById(id).map(eventparticipant -> {
            EventParticipantRepository.delete(eventparticipant);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/eventparticipant/{id}")
    public ResponseEntity<EventParticipant> updateEventParticipant(@PathVariable Long id, @RequestBody EventParticipant eventparticipant) {
        return EventParticipantRepository.findById(id).map(existeventparticipant -> {
            // eventparticipant.setContent(eventparticipant.getContent()); // Giả sử EventParticipant có thuộc tính content
            return ResponseEntity.ok(EventParticipantRepository.save(existeventparticipant));
        }).orElse(ResponseEntity.notFound().build());
    }


    // Event
    @GetMapping("/event")
    public List<Event> getAllEvents() {
        return EventRepository.findAll();
    }

    @PostMapping("/event")
    public Event createEvent(@RequestBody Event event) {
        return EventRepository.save(event);
    }

    @DeleteMapping("/event/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        return EventRepository.findById(id).map(event -> {
            EventRepository.delete(event);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/event/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event event) {
        return EventRepository.findById(id).map(existevent -> {
            // event.setContent(event.getContent()); // Giả sử Event có thuộc tính content
            return ResponseEntity.ok(EventRepository.save(existevent));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Follow
    @GetMapping("/follow")
    public List<Follow> getAllFollows() {
        return FollowRepository.findAll();
    }

    @PostMapping("/follow")
    public Follow createFollow(@RequestBody Follow follow) {
        return FollowRepository.save(follow);
    }

    @DeleteMapping("/follow/{id}")
    public ResponseEntity<?> deleteFollow(@PathVariable Long id) {
        return FollowRepository.findById(id).map(follow -> {
            FollowRepository.delete(follow);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/follow/{id}")
    public ResponseEntity<Follow> updateFollow(@PathVariable Long id, @RequestBody Follow follow) {
        return FollowRepository.findById(id).map(existfollow -> {
            // follow.setContent(follow.getContent()); // Giả sử Follow có thuộc tính content
            return ResponseEntity.ok(FollowRepository.save(existfollow));
        }).orElse(ResponseEntity.notFound().build());
    }

    // FriendShip
    @GetMapping("/FriendShip")
    public List<FriendShip> getAllFriendShips() {
        return FriendShipRepository.findAll();
    }

    @PostMapping("/FriendShip")
    public FriendShip createFriendship(@RequestBody FriendShip friendship) {
        return FriendShipRepository.save(friendship);
    }

    @DeleteMapping("/FriendShip/{id}")
    public ResponseEntity<?> deleteFriendship(@PathVariable Long id) {
        return FriendShipRepository.findById(id).map(friendship -> {
            FriendShipRepository.delete(friendship);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/friendship/{id}")
    public ResponseEntity<FriendShip> updateFriendship(@PathVariable Long id, @RequestBody FriendShip friendship) {
        return FriendShipRepository.findById(id).map(existfriendship -> {
            // friendship.setContent(friendship.getContent()); // Giả sử Friendship có thuộc tính content
            return ResponseEntity.ok(FriendShipRepository.save(existfriendship));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Like
    @GetMapping("/like")
    public List<Like> getAllLikes() {
        return LikeRepository.findAll();
    }
    
    @PostMapping("/like")
    public Like createLike(@RequestBody Like like) {
        return LikeRepository.save(like);
    }

    @DeleteMapping("/like/{id}")
    public ResponseEntity<?> deleteLike(@PathVariable Long id) {
        return LikeRepository.findById(id).map(like -> {
            LikeRepository.delete(like);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/like/{id}")
    public ResponseEntity<Like> updateLike(@PathVariable Long id, @RequestBody Like like) {
        return LikeRepository.findById(id).map(existlike -> {
            // like.setContent(like.getContent()); // Giả sử Like có thuộc tính content
            return ResponseEntity.ok(LikeRepository.save(existlike));
        }).orElse(ResponseEntity.notFound().build());
    }


    // Message
    @GetMapping("/message")
    public List<Message> getAllMessages() {
        return MessageRepository.findAll();
    }

    @PostMapping("/message")
    public Message createMessage(@RequestBody Message message) {
        return MessageRepository.save(message);
    }

    @DeleteMapping("/message/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long id) {
        return MessageRepository.findById(id).map(message -> {
            MessageRepository.delete(message);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/message/{id}")
    public ResponseEntity<Message> updateMessage(@PathVariable Long id, @RequestBody Message message) {
        return MessageRepository.findById(id).map(existmessage -> {
            // message.setContent(message.getContent()); // Giả sử Message có thuộc tính content
            return ResponseEntity.ok(MessageRepository.save(existmessage));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Notification
    @GetMapping("/notification")
    public List<Notification> getAllNotifications() {
        return NotificationRepository.findAll();
    }

    @PostMapping("/notification")
    public Notification createNotification(@RequestBody Notification notification) {
        return NotificationRepository.save(notification);
    }

    @DeleteMapping("/notification/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        return NotificationRepository.findById(id).map(notification -> {
            NotificationRepository.delete(notification);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/notification/{id}")
    public ResponseEntity<Notification> updateNotification(@PathVariable Long id, @RequestBody Notification notification) {
        return NotificationRepository.findById(id).map(existnotification -> {
            // notification.setContent(notification.getContent()); // Giả sử Notification có thuộc tính content
            return ResponseEntity.ok(NotificationRepository.save(existnotification));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Post
    @GetMapping("/post")
    public List<Post> getAllPosts() {
        return PostRepository.findAll();
    }

    @PostMapping("/post")
    public Post createPost(@RequestBody Post post) {
        return PostRepository.save(post);
    }

    @DeleteMapping("/post/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        return PostRepository.findById(id).map(post -> {
            PostRepository.delete(post);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/post/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post post) {
        return PostRepository.findById(id).map(existpost -> {
            // post.setContent(post.getContent()); // Giả sử Post có thuộc tính content
            return ResponseEntity.ok(PostRepository.save(existpost));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Group
    @GetMapping("/group")
    public List<Group> getAllGroups() {
        return GroupRepository.findAll();
    }

    @PostMapping("/group")
    public Group createGroup(@RequestBody Group group) {
        return GroupRepository.save(group);
    }

    @DeleteMapping("/group/{id}")
    public ResponseEntity<?> deleteGroup(@PathVariable Long id) {
        return GroupRepository.findById(id).map(group -> {
            GroupRepository.delete(group);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/group/{id}")
    public ResponseEntity<Group> updateGroup(@PathVariable Long id, @RequestBody Group group) {
        return GroupRepository.findById(id).map(existgroup -> {
            // group.setContent(group.getContent()); // Giả sử Group có thuộc tính content
            return ResponseEntity.ok(GroupRepository.save(existgroup));
        }).orElse(ResponseEntity.notFound().build());
    }

    // GroupMember
    @GetMapping("/groupmember")
    public List<GroupMember> getAllGroupMembers() {
        return GroupMemberRepository.findAll();
    }

    @PostMapping("/groupmember")
    public GroupMember createGroupMember(@RequestBody GroupMember groupmember) {
        return GroupMemberRepository.save(groupmember);
    }

    @DeleteMapping("/groupmember/{id}")
    public ResponseEntity<?> deleteGroupMember(@PathVariable Long id) {
        return GroupMemberRepository.findById(id).map(groupmember -> {
            GroupMemberRepository.delete(groupmember);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/groupmember/{id}")
    public ResponseEntity<GroupMember> updateGroupMember(@PathVariable Long id, @RequestBody GroupMember groupmember) {
        return GroupMemberRepository.findById(id).map(existgroupmember -> {
            // groupmember.setContent(groupmember.getContent()); // Giả sử GroupMember có thuộc tính content
            return ResponseEntity.ok(GroupMemberRepository.save(existgroupmember));
        }).orElse(ResponseEntity.notFound().build());
    }

    // User
    @GetMapping("/user")
    public List<User> getAllUsers() {
        return UserRepository.findAll();
    }

    @PostMapping("/user")
    public User createUser(@RequestBody User user) {
        return UserRepository.save(user);
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return UserRepository.findById(id).map(user -> {
            UserRepository.delete(user);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return UserRepository.findById(id).map(existuser -> {
            // user.setContent(user.getContent()); // Giả sử User có thuộc tính content
            return ResponseEntity.ok(UserRepository.save(existuser));
        }).orElse(ResponseEntity.notFound().build());
    }
    

}
