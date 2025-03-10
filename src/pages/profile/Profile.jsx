import "./profile.css";
// import Topbar from "../../components/topbar/topbar";
import SidebarProfile from "../../components/sidebarprofile/SidebarProfile";
import Share from "../../components/share/Share";
import Post from "../../components/post/Post";
import {PhotoCamera} from "@mui/icons-material"

export default function Profile() {
    return (
        <>
            {/* <Topbar /> */}
            <div className="profile">
                <div className="profileTop">
                    <div className="profileCover">
                        <img
                            className="profileCoverImg"
                            src="asset/post/2.jpeg"
                            alt=""
                        />
                        <button className="changeCoverBtn">Thêm ảnh bìa</button>
                        <img
                            className="profileUserImg"
                            src="asset/person/1.jpeg"
                            alt=""
                        />
                        <button className="cameraIcon">
                                <PhotoCamera />
                        </button>
                    </div>
                    <h4 className="profileName">Tui Nè Quý Dị</h4>
                </div>
                <div className="profileBottom">
                    <div className="profileBottomContain">
                        <div className="profileBottomContainLeft">
                            <SidebarProfile/>
                        </div>
                        <div className="profileBottomContainRight">
                            <Share/>
                            <Post/>
                            <Post/>
                            <Post/>
                        </div>
                    </div>   
                </div>
            </div>
        </>
    );
}