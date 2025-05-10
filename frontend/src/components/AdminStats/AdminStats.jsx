import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import "./AdminStats.css";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const AdminStats = () => {
    const { theme } = useTheme();
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [newUsersToday, setNewUsersToday] = useState(0);
    const [userGrowthData, setUserGrowthData] = useState([]);

    useEffect(() => {
        setNewUsersToday(15);
        setUserGrowthData([
        { date: "2025-03-30", count: 10 },
        { date: "2025-03-31", count: 18 },
        { date: "2025-04-01", count: 14 },
        { date: "2025-04-02", count: 22 },
        { date: "2025-04-03", count: 15 },
        ]);

        const getUserCount = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/user/count');
                const data = await response.json();
                setTotalUsers(data.userCount);
            } catch (error) {
                console.error('Error fetching user count:', error);
            }
        };

        const getPostCount = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/post/count');
                const data = await response.json();
                setTotalPosts(data.postCount);
            } catch (error) {
                console.error('Error fetching user count:', error);
            }
        };
        
        getPostCount();
        getUserCount();
    }, []);

    return (
        <div className={`admin-stats ${theme}`}>
        <h2>Thống kê hệ thống</h2>

        <div className="stat-cards">
            <div className="stat-card">
            <h3>Tổng người dùng</h3>
            <p>{totalUsers}</p>
            </div>
            <div className="stat-card">
            <h3>Tổng bài viết</h3>
            <p>{totalPosts}</p>
            </div>
            <div className="stat-card">
            <h3>Người dùng mới hôm nay</h3>
            <p>{newUsersToday}</p>
            </div>
        </div>

        <div className="chart-section">
            <h3>Người dùng mới theo ngày</h3>
            <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" name="Người dùng mới" />
            </LineChart>
            </ResponsiveContainer>
        </div>
        </div>
    );
};

export default AdminStats;
