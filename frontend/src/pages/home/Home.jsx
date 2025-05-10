import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
// import Topbar from "../../components/topbar/topbar";
import "./home.css"

export default function Home() {
  return (
      <div className="homeContainer">
        {/* <Topbar/> */}
        <Sidebar/>
        <Feed/>
        <Rightbar/>
      </div>
  );
}