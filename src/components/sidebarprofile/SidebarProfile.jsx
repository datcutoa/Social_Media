import "./sidebarprofile.css";

export default function SidebarProfile() {
  return (
    <div className="SidebarProfile">
        <div className="SidebarProfileTop">
          <h3>Giới thiệu</h3>
          <p className="SidebarProfileBio">
            Xin chào! Tôi là <strong>Quách</strong>, một người đam mê công nghệ
            và lập trình. Thích khám phá những điều mới mẻ và xây dựng những sản phẩm hữu ích.
          </p>
        </div>
        <div className="SidebarProfileBottom">
          <h4>Bạn bè</h4>
        </div>
    </div>
  );
}
