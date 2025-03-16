-- data.sql

-- 1. Insert users (bảng users)
INSERT INTO users (username, email, password, name, bio, profile_picture, cover_photo, gender, birthdate)
VALUES 
('user1', 'user1@example.com', 'password1', 'User One', 'Bio of User One', 'pic1.jpg', 'cover1.jpg', 'Nam', '1990-01-01'),
('user2', 'user2@example.com', 'password2', 'User Two', 'Bio of User Two', 'pic2.jpg', 'cover2.jpg', 'Nữ', '1992-02-02'),
('user3', 'user3@example.com', 'password3', 'User Three', 'Bio of User Three', 'pic3.jpg', 'cover3.jpg', 'Khác', '1994-03-03');

-- 2. Insert posts (bảng posts)
INSERT INTO posts (user_id, content, media_url, privacy)
VALUES 
(1, 'This is the first post content.', 'media1.jpg', 'Công khai'),
(2, 'This is the second post content.', 'media2.jpg', 'Bạn bè'),
(3, 'This is the third post content.', 'media3.jpg', 'Riêng tư');

-- 3. Insert comments (bảng comments)
INSERT INTO comments (post_id, user_id, content)
VALUES 
(1, 2, 'Nice post!'),
(1, 3, 'Great content!'),
(2, 1, 'Thank you for sharing.');

-- 4. Insert likes (bảng likes)
-- Lưu ý: mỗi hàng chỉ insert like cho post hoặc comment (sử dụng NULL cho cột không dùng)
INSERT INTO likes (user_id, post_id, comment_id)
VALUES 
(1, 1, NULL),
(2, NULL, 1),
(3, 2, NULL);

-- 5. Insert events (bảng events)
INSERT INTO events (user_id, name, description, location, start_time, end_time, privacy)
VALUES 
(1, 'Event One', 'Description for Event One', 'Location A', '2025-04-01 10:00:00', '2025-04-01 12:00:00', 'Công khai'),
(2, 'Event Two', 'Description for Event Two', 'Location B', '2025-05-01 14:00:00', '2025-05-01 16:00:00', 'Bạn bè'),
(3, 'Event Three', 'Description for Event Three', 'Location C', '2025-06-01 09:00:00', '2025-06-01 11:00:00', 'Riêng tư');

-- 6. Insert event participants (bảng event_participants)
INSERT INTO event_participants (event_id, user_id, status)
VALUES 
(1, 2, 'Tham gia'),
(1, 3, 'Quan tâm'),
(2, 1, 'Không tham gia');

-- 7. Insert groups (bảng groups)
INSERT INTO groups (name, description, privacy)
VALUES 
('Group One', 'Description for Group One', 'Công khai'),
('Group Two', 'Description for Group Two', 'Riêng tư'),
('Group Three', 'Description for Group Three', 'Bí mật');

-- 8. Insert group members (bảng group_members)
INSERT INTO group_members (group_id, user_id, role)
VALUES 
(1, 1, 'Người tạo'),
(1, 2, 'Thành viên'),
(2, 3, 'Quản trị viên');

-- 9. Insert friendships (bảng friendships)
INSERT INTO friendships (user_id, friend_id, status)
VALUES 
(1, 2, 'Đã kết bạn'),
(2, 3, 'Đang chờ'),
(1, 3, 'Đã từ chối');

-- 10. Insert follows (bảng follows)
INSERT INTO follows (follower_id, following_id)
VALUES 
(1, 2),
(2, 3),
(3, 1);

-- 11. Insert messages (bảng messages)
INSERT INTO messages (sender_id, receiver_id, content, read_status)
VALUES 
(1, 2, 'Hello from user1 to user2', 0),
(2, 3, 'Hello from user2 to user3', 1),
(3, 1, 'Hello from user3 to user1', 0);

-- 12. Insert notifications (bảng notifications)
INSERT INTO notifications (user_id, type, reference_id, content, read_status)
VALUES 
(1, 'Thích', 1, 'User1 liked a post', 0),
(2, 'Bình luận', 2, 'User2 commented on a post', 0),
(3, 'Kết bạn', 3, 'User3 sent a friend request', 1);
