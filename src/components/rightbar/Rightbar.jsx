import "./rightbar.css"
import Online from "../online/Online"

export default function Rightbar() {
  return (
    <div className='rightbar'>
      <div className="rightbarWrapper">
        <div className="birthdayContainer">
          <img className="birthdayImg" src="asset/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friend</b> have a birthday today 
          </span>
        </div>
        <img className="rightbarAd" src="asset/ad.png" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          <Online/>  
          <Online/>
          <Online/>
          <Online/>
          <Online/>
          <Online/>
        </ul>
      </div>
    </div>
  )
}
