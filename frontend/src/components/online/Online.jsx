// Online.js
import React from 'react';
import './online.css';

export default function Online({ user, onClick }) {
  return (
    <li className="rightbarFriend" onClick={() => onClick(user)}>
      <div className="rightbarProfileImgContainer">
        <img
          className="rightbarProfileImg"
          src={`/uploads/avatar/${user.profilePicture}`}
          alt=""
        />
        <span className="rightbarOnline"></span>
      </div>
      <span className="rightbarUsername">{user.fulname}</span>
    </li>
  );
}