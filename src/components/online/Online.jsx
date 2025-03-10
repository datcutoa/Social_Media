import "./online.css"

export default function Online() {
  return (
    <li className="rightbarFriend">
        <div className="rightbarProfileImgContainer">
            <img className="rightbarProfileImg" src="asset/person/1.jpeg" alt="" />
            <span className="rightbarOnline"></span>
        </div>
        <span className="rightbarUsername">Quách</span>
    </li>
  )
}