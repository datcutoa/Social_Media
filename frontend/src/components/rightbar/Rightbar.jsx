import React, { useEffect, useState } from 'react';
import './rightbar.css';
import Online from '../online/Online';
import Chat from '../chat/Chat';

export default function Rightbar() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [listFriends, setListFriends] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.id;
  useEffect(() => {
    const loadFriends = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/friendship/friends/${userId}`);
    
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch friends: ${response.status} ${errorText}`);
        }
    
        const data = await response.json();
        
        // Nếu muốn in ra id và username của từng người bạn:
        const friendsInfo = data.map(friend => ({
          id: friend.id,
          profilePicture: friend.profilePicture,
          fulname: friend.name
        }));
    
        // console.log("Danh sách bạn bè:", friendsInfo);
    
        setListFriends(friendsInfo);
        return data;
      } catch (error) {
        console.error("Error fetching friends:", error.message);
      }
    };
    loadFriends();
  }, []);

  // Hàm mở chat khi nhấp vào Online
  const handleOpenChat = (user) => {
    setSelectedUser(user);
    setIsChatOpen(true);
  };

  // Hàm đóng chat
  const handleCloseChat = () => {
    setIsChatOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        <div className="birthdayContainer">
          <img className="birthdayImg" src="asset/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birthday today
          </span>
        </div>
        <img className="rightbarAd" src="asset/ad.png" alt="" />
        <h4 className="rightbarTitle">Bạn bè đang hoạt động</h4>
        <ul className="rightbarFriendList">
          {listFriends.map((user) => (
            <Online key={user.id} user={user} onClick={handleOpenChat} />
          ))}
        </ul>
      </div>
      {isChatOpen && selectedUser && (
        <Chat
          userId={selectedUser.id}
          fullName={selectedUser.fulname}
          profilePic={selectedUser.profilePicture}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
}