import "./feed.css";
import Share from "../share/Share";
import Post from "../post/Post";
import { useState, useEffect } from "react";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [friendStatuses, setFriendStatuses] = useState({}); // lưu trạng thái bạn bè theo userId
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/post", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        const activePosts = data.filter(post => post.status === 1);
        const sorted = activePosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sorted);
        fetchFriendStatuses(sorted);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const fetchFriendStatuses = async (postsList) => {
      const statuses = {};
      const checked = new Set();

      await Promise.all(postsList.map(async (post) => {
        const postUserId = post.userId;
        if (postUserId !== userId && !checked.has(postUserId)) {
          try {
            const res = await fetch(`http://localhost:8080/api/friendship/status?userId=${userId}&friendId=${postUserId}`, {
              headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              }
            });
            if (res.ok) {
              const result = await res.json();
              statuses[postUserId] = result.status;
            } else {
              statuses[postUserId] = null;
            }
            checked.add(postUserId);
          } catch (err) {
            console.error("Error fetching friend status:", err);
            statuses[postUserId] = null;
          }
        }
      }));

      setFriendStatuses(statuses);
    };

    fetchPosts();
  }, []);

  const canViewPost = (post) => {
    if (post.user.id === userId) return true; // chủ bài viết, luôn được xem
    if (post.privacy === "CONG_KHAI") return true;
    if (post.privacy === "BAN_BE" && friendStatuses[post.user.id] === "DA_KET_BAN") return true;
    if (post.privacy === "RIENG_TU" && post.userId === userId) return true;
    return false;
  };

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        {posts.length > 0 ? (
          posts
            .filter(canViewPost) // chỉ lọc bài viết mà người dùng có quyền xem
            .map(post => <Post key={post.id} post={post} />) // hiển thị bài viết
        ) : (
          <p className="noPost">Chưa có bài viết nào.</p>
        )}
      </div>
    </div>
  );
}
