import { useEffect, useState } from "react";
import dongbei from "../assets/dongbei.png";
import { useNavigate } from "react-router-dom";

export default function SideBar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

  function handleLogout(e) {
    e.preventDefault();
    if (isAuthenticated) {
      window.alert("登出成功！");
      localStorage.removeItem("isAuthenticated");

      setIsAuthenticated((set) => !set);
      navigate("/login");
    }
  }

  return (
    <div className="side-bar">
      <ul>
        <li>
          <a href="/home">数据参数</a>
        </li>
        <li>
          <a href="/preset">配置网络参数</a>
        </li>
        <li>
          <a href="/">训练样本数据</a>
        </li>
        <li>
          <a href="/">验证样本数据</a>
        </li>
        <li>
          <a href="/">模型构建</a>
        </li>
        <li>
          <a href="/">辅助样本数据</a>
        </li>
        <li>
          <a href="/">模型预测</a>
        </li>
        <li>
          <a
            onClick={handleLogout}
            style={{
              color: !isAuthenticated ? "#002060" : "",
              pointerEvents: !isAuthenticated ? "none" : "auto", // Prevent clicking
            }}
          >
            登出
          </a>
        </li>
      </ul>
      <img className="side-bar-img" src={dongbei}></img>
    </div>
  );
}
