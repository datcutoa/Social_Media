import "./feed.css";
import Share from "../share/Share";
import Post from "../post/Post";
import { useState, useEffect } from "react";

export default function Feed() {
  const [list, setList] = useState([]);

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
        const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setList(sortedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []); // Thêm [] để useEffect chỉ chạy một lần khi component mount

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        {list.length > 0 ? (
          list.map((post) => <Post key={post.id} post={post} />)
        ) : (
          <p className="noPost">Chưa có bài viết nào.</p>
        )}
      </div>
    </div>
  );
}