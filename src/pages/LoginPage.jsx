/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { loginUser } from "../services/loginService";
import axios from "axios";

export default function LoginPage({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  function validateInputs() {
    if (!email && !password) {
      // setErrorMsg(() => "必须填入邮箱和密码。");
      toast.error("必须填入邮箱和密码。");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      // setErrorMsg((msg) => msg("邮箱格式不符合。"));
      toast.error("邮箱格式不符合。")
      return false;
    }

    if (password.length < 4) {
      // setErrorMsg(() => "密码输入长度必须大于4个字节。");
      toast.error("密码输入长度必须大于4个字节。")
      return false;
    }
    return true;
  }

  async function handleLogin(event) {
    event.preventDefault();

    const stats = validateInputs();

    if (stats) {
      try{
        const response = await loginUser(email, password);
        if (response.status) {
          toast.success("登入成功！");
          setIsSuccess(() => !isSuccess);
          setTimeout(() => {
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', JSON.stringify(true))
            localStorage.setItem('userData', JSON.stringify(response.value))
            navigate("/");
          }, 3000);
        }
      }
      catch (error) {
        toast.error(error.response.data.message);
      }
    }
  }

  // useEffect(() => {
  //   if (errorMsg) {
  //     toast.error(errorMsg);
  //   }
  // }, [errorMsg]);

  return (
    <div className="login">
      <h1>登入界面</h1>
      <form onSubmit={handleLogin}>
        <div className="login-label">
          <label>邮箱</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="login-label">
          <label>密码</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <br />
        <button disabled={isSuccess} type="submit">
          登入
        </button>
        <br />
        {/* <button onClick={handleLogin}>登入</button> */}
      </form>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </div>
  );
}
