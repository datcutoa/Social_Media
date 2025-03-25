import "./notificationsPopup.css";

export default function NotificationsPopup({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="popupContainer">
      <div className="popupHeader">
        <h3>Thông báo</h3>
        <button onClick={onClose} className="closeButton">X</button>
      </div>
      <ul className="popupList">
        <li className="popupItem">Bạn có 1 lời mời kết bạn</li>
        <li className="popupItem">Người dùng A đã thích bài viết của bạn</li>
      </ul>
    </div>
  );
}
