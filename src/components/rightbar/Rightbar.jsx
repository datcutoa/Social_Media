import React, { useState } from 'react';
import './rightbar.css';
import Online from '../online/Online';
import Chat from '../chat/Chat';

export default function Rightbar() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Danh sách bạn bè online (dữ liệu giả lập)
  const onlineFriends = [
    { id: 1, username: 'Quách', profilePicture: 'asset/person/1.jpeg' },
    { id: 2, username: 'Tran Van A', profilePicture: 'asset/person/2.jpeg' },
    { id: 3, username: 'Le Thi B', profilePicture: 'asset/person/2.jpeg' },
    { id: 4, username: 'Pham Van C', profilePicture: 'asset/person/2.jpeg' },
    { id: 5, username: 'Hoang Thi D', profilePicture: 'asset/person/2.jpeg' },
    { id: 6, username: 'Nguyen Van E', profilePicture: 'asset/person/2.jpeg' },
  ];

  // Hàm mở chat khi nhấp vào Online
  const handleOpenChat = (user) => {
    console.log(user)
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
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {onlineFriends.map((user) => (
            <Online key={user.id} user={user} onClick={handleOpenChat} />
          ))}
        </ul>
      </div>
      {isChatOpen && selectedUser && (
        <Chat
          userName={selectedUser.username}
          profilePic={selectedUser.profilePicture}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
}