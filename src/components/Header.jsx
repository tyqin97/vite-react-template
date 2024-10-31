import blueLogo from "../assets/blue-logo.jpg"

export default function Header() {
  return (
    <header className="header">
      <h1 className="left-item">锐策智能</h1>
      <h1 className="center-item">基于随机配置网络的工业数据建模软件</h1>
      <img className="right-item" src={blueLogo} />
    </header>
  );
}
