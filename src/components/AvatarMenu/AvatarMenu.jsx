import "./avatarMenu.css";
import { Link } from "react-router-dom";

export default function AvatarMenu({ isOpen, onClose, onLogout }) {
    return (
        isOpen && (
            <div className="avatarMenu">
            <Link to="/change-password" className="avatarMenuItem" onClick={onClose}>
                Đổi mật khẩu
            </Link>
            <span className="avatarMenuItem" onClick={onLogout}>
                Đăng xuất
            </span>
            </div>
        )
    );
}
