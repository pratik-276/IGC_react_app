import { useState, useEffect } from "react";
import user1 from "../assets/images/users/user4.jpg";
import logo from "../assets/images/logos/logo.png";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./AntdLayout.css";
import { FaChartLine, FaChartPie, FaCompassDrafting, FaHouse, FaRegStar, FaRegUser } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";

const { Header, Sider, Content } = Layout;

const AppLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [profile, setProfile] = useState({});

    const user_id = localStorage.getItem("user_id");

    const toggle = () => setCollapsed(!collapsed);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const menuItems = [
        {
            key: "/",
            icon: <FaHouse />,
            label: "Home",
        },
        {
            key: "calibrate",
            label: "Calibrate",
            icon: <FaCompassDrafting />,
            children: [
                {
                    key: "/calibrate-compass",
                    icon: <FaCompassDrafting />,
                    label: "Calibrate Compass",
                },
            ],
        },
        {
            key: "position",
            label: "⁠Game Positions",
            icon: <DashboardOutlined />,
            children: [
                {
                    key: "/dashboard",
                    icon: <DashboardOutlined />,
                    label: "Position Trends",
                },
            ],
        },
        {
            key: "casino",
            label: "Casino Overview",
            icon: <FaChartLine />,
            children: [
                {
                    key: "/competitor-dashboard",
                    icon: <FaChartLine />,
                    label: "Daily Layout",
                },
            ],
        },
        {
            key: "game",
            label: "Market Intelligence",
            icon: <FaRegStar />,
            children: [
                {
                    key: "/game-rank-report",
                    icon: <FaRegStar />,
                    label: "Game Rank",
                },
                {
                    key: "/game-provider-marketshare",
                    icon: <FaChartPie />,
                    label: "Marketshare",
                },
            ],
        },
    ];

    const onMenuClick = ({ key }) => {
        navigate(key);
    };

    const profileDropdownMenu = (
        <Menu onClick={({ key }) => {
            if (key === "account") navigate("/my-account");
            if (key === "logout") handleLogout();
        }}>
            <Menu.Item key="account" icon={<FaRegUser />}>
                My Account
            </Menu.Item>
            <Menu.Item key="logout" icon={<FaSignOutAlt />}>
                Logout
            </Menu.Item>
        </Menu>
    );

    useEffect(() => {
        const name = localStorage.getItem("user_name") || "User";
        const email = localStorage.getItem("user_email") || "";
        setProfile({ name, email });
    }, []);

    return (

        <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: "margin-left 0.2s" }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={250}
                collapsedWidth={80}
                style={{
                    background: "#392f6c",
                    height: "100vh",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 1000,
                }}
            >
                <div className="sidebar-logo">
                    <img src={logo} alt="Logo" className="sidebar-logo-img" />
                    {!collapsed && <span className="sidebar-logo-text">iGaming Compass</span>}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    onClick={onMenuClick}
                    items={menuItems}
                />
            </Sider>

            <Layout style={{ background: "#f0f2f5", minHeight: "100vh" }}>
                <Header className="custom-header">
                    <div className="header-toggle-icon">
                        {collapsed ? (
                            <MenuUnfoldOutlined onClick={toggle} />
                        ) : (
                            <MenuFoldOutlined onClick={toggle} />
                        )}
                    </div>

                    <div className="header-right-section">
                        <div className="profile-info">
                            <div className="profile-name">{profile.name}</div>
                            <div className="profile-email">{profile.email}</div>
                        </div>

                        <Dropdown overlay={profileDropdownMenu} trigger={["click"]}>
                            <div className="avatar-wrapper">
                                <Avatar size="large" src={<img src={user1} alt="avatar" />} />
                            </div>
                        </Dropdown>
                    </div>
                </Header>

                <Content style={{ margin: "16px", padding: 24, background: "#fff" }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AppLayout;
