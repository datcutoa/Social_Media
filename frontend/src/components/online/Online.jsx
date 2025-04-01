// Online.js
import React from 'react';
import './online.css';

export default function Online({ user, onClick }) {
  return (
    <li className="rightbarFriend" onClick={() => onClick(user)}>
      <div className="rightbarProfileImgContainer">
        <img
          className="rightbarProfileImg"
          src={user.profilePicture || 'https://via.placeholder.com/50'}
          alt=""
        />
        <span className="rightbarOnline"></span>
      </div>
      <span className="rightbarUsername">{user.username}</span>
    </li>
  );
}