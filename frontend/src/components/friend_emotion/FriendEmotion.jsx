import React, { useState } from 'react';
import './friendemotion.css'; // Tên file CSS giữ nguyên
import { PersonAdd, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const FriendList = ({onClose,postId}) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const currentUserId = user?.id;
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriendsWhoLikedPost = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/like/post/${postId}/users`, {
          method: "GET", // specify the HTTP method
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const data = await response.json();
        setFriends(data);
      } catch (error) {
        console.error("Error fetching friends who liked the post:", error);
      }
    };
    fetchFriendsWhoLikedPost();
  }, [postId]);

  const handleVisitProfile = (userId) => {
    if (userId === currentUserId) {
      navigate(`/profile/${userId}`);
    } else {
      navigate(`/visitfriend/${userId}`);
    }
  };

  return (
    <div className="friendListOverlay">
      <div className="friendList">
        {/* Header của danh sách bạn bè */}
        <div className="friendListHeader">
          <span>Tất cả</span>
          <span className="closeButton" onClick={onClose}>×</span>
        </div>

        {/* Nội dung danh sách bạn bè */}
        <div className="friendListContent">
          {friends.map((friend) => (
            <div key={friend.id} className="friendItems">
              <img
                src={`/uploads/avatar/${friend.profilePicture}`}
                alt={`${friend.name}'s avatar`}
                className="friendAvatar"
                onClick={() => handleVisitProfile(friend.id)}
                style={{ cursor: 'pointer' }}
              />
              <div className="friendInfo">
                <span
                  className="friendName"
                  onClick={() => handleVisitProfile(friend.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {friend.name}
                </span>
                <span className="mutualFriends">{friend.mutualFriends}</span>
              </div>
              <button className="actionemotionButton">
                {friend.action === 'add' ? (
                  <>
                    <PersonAdd className="actionemtionIcon" /> Thêm bạn bè
                  </>
                ) : (
                  <>
                    <Visibility className="actionemtionIcon" /> Theo dõi
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendList;