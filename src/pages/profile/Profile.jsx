import "./profile.css";
import SidebarProfile from "../../components/sidebarprofile/SidebarProfile";
import Share from "../../components/share/Share";
import Post from "../../components/post/Post";
import { PhotoCamera } from "@mui/icons-material";
import { useRef, useState } from "react";
import FriendList from "../../components/FriendList/FriendList"; // Import FriendList

export default function Profile() {
    const coverFileInputRef = useRef(null);
    const profileFileInputRef = useRef(null);

    const [selectedCoverImage, setSelectedCoverImage] = useState(null);
    const [selectedProfileImage, setSelectedProfileImage] = useState(null);
    const [isCoverImageSelected, setIsCoverImageSelected] = useState(false);
    const [isProfileImageSelected, setIsProfileImageSelected] = useState(false);
    const [activeTab, setActiveTab] = useState("Bài viết"); // Trạng thái tab active

    const handleCoverClick = () => {
        if (!isCoverImageSelected) {
            coverFileInputRef.current.click();
        } else {
            console.log("Saving cover image:", selectedCoverImage);
        }
    };

    const handleCameraClick = () => {
        if (!isProfileImageSelected) {
            profileFileInputRef.current.click();
        } else {
            console.log("Saving profile image:", selectedProfileImage);
        }
    };

    const handleCoverFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedCoverImage(imageUrl);
            setIsCoverImageSelected(true);
            console.log("Cover file selected:", file);
        }
    };

    const handleProfileFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedProfileImage(imageUrl);
            setIsProfileImageSelected(true);
            console.log("Profile file selected:", file);
        }
    };

    return (
        <>
            <div className="profile">
                <div className="profileTop">
                    <div className="profileCover">
                        <img
                            className="profileCoverImg"
                            src={selectedCoverImage || "asset/post/2.jpeg"}
                            alt=""
                        />
                        <button className="changeCoverBtn" onClick={handleCoverClick}>
                            {isCoverImageSelected ? "Lưu" : <PhotoCamera />}
                        </button>
                        <img
                            className="profileUserImg"
                            src={selectedProfileImage || "asset/person/1.jpeg"}
                            alt=""
                        />
                        <button className="cameraIcon" onClick={handleCameraClick}>
                            {isProfileImageSelected ? "Lưu" : <PhotoCamera />}
                        </button>
                        <input
                            type="file"
                            ref={coverFileInputRef}
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={handleCoverFileChange}
                        />
                        <input
                            type="file"
                            ref={profileFileInputRef}
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={handleProfileFileChange}
                        />
                    </div>
                    <h4 className="profileName">Tui Nè Quý Dị</h4>
                    <div className="menuItem">
                        <ul>
                            <li
                                className={activeTab === "Bài viết" ? "active" : ""}
                                onClick={() => setActiveTab("Bài viết")}
                            >
                                Bài viết
                            </li>
                            <li
                                className={activeTab === "Bạn bè" ? "active" : ""}
                                onClick={() => setActiveTab("Bạn bè")}
                            >
                                Bạn bè
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="profileBottom">
                    <div className="profileBottomContain">
                        {activeTab === "Bài viết" ? (
                            <>
                                <div className="profileBottomContainLeft">
                                    <SidebarProfile setActiveTab={setActiveTab} />

                                </div>
                                <div className="profileBottomContainRight">
                                    <Share />
                                    <Post />
                                    <Post />
                                    <Post />
                                </div>
                            </>
                        ) : (
                            <div className="profileBottomContainFull">
                                <FriendList />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}