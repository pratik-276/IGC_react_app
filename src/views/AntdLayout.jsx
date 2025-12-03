import { useContext, useState, useEffect } from "react";
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
import { FaChartBar, FaChartLine, FaChartPie, FaCompassDrafting, FaHouse, FaRegStar, FaRegUser } from "react-icons/fa6";
import { FaCompass } from "react-icons/fa6";
import { GiPositionMarker } from "react-icons/gi";
import { FaRankingStar } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { MdCasino } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import profileService from "../services/Profile";
import { ProfileSystem } from "../context/ProfileContext";
import { IoMdHelp } from "react-icons/io";
import toast from "react-hot-toast";

const { Header, Sider, Content } = Layout;

const AppLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [profile, setProfile] = useState({});

    const user_id = localStorage.getItem("user_id");

    const { dispatch } = useContext(ProfileSystem);

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
            key: "/dashboard",
            icon: <GiPositionMarker />,
            label: "Positions Dashboard",
        },
        {
            key: "/calibrate-compass",
            icon: <FaCompass />,
            label: "Calibrate Compass",
        },
        // {
        //     key: "position",
        //     label: "⁠Game Positions",
        //     icon: <DashboardOutlined />,
        //     children: [
        //         {
        //             key: "/dashboard",
        //             icon: <GiPositionMarker />,
        //             label: "Positions Dashboard",
        //         },
        //     ],
        // },
        // {
        //     key: "calibrate",
        //     label: "Calibrate",
        //     icon: <FaCompassDrafting />,
        //     children: [
        //         {
        //             key: "/calibrate-compass",
        //             icon: <FaCompass />,
        //             label: "Calibrate Compass",
        //         },
        //     ],
        // },
        {
            key: "dataview",
            label: "Data View",
            icon: <FaChartLine />,
            children: [
                {
                    key: "/competitor-dashboard",
                    icon: <MdCasino />,
                    label: "Competitor Dashboard",
                },
                {
                    key: "/casino-view",
                    icon: <MdDashboard />,
                    label: "View Casino Data",
                },
            ],
        },
        {
            key: "request",
            label: "Requests",
            icon: <IoMdHelp />,
            children: [
                {
                    key: "/requested-casinos",
                    icon: <MdCasino />,
                    label: "Requested Casinos",
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
                    icon: <FaRankingStar />,
                    label: "Game Rank",
                },
                {
                    key: "/game-provider-marketshare",
                    icon: <FaChartPie />,
                    label: "Marketshare",
                },
            ],
        },
        // {
        //     key: "analytics",
        //     label: "Analytics",
        //     icon: <FaChartBar />,
        //     children: [
        //         {
        //             key: "/analytics",
        //             icon: <FaChartBar />,
        //             label: "Game Analysis",
        //         },
        //     ],
        // },
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

    const getProfile = async () => {
        try {
            const profileResponse = await profileService.Profile({
                user_id: parseInt(user_id),
            });

            if (profileResponse?.success) {
                setProfile(profileResponse?.data);
                console.log(profileResponse?.data);
                localStorage.setItem("user_company", profileResponse?.data.company);
                localStorage.setItem("user_email", profileResponse?.data.email);

                dispatch({
                    type: "SET_PLAN",
                    payload: { plan: profileResponse?.data?.plan },
                });
            } else if (profileResponse?.error?.status === 401) {
                localStorage.clear();
                toast.error("Session expired. Please log in again.");
                navigate("/login");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred. Please try again.");
        }
    };

    useEffect(() => {
        // const name = localStorage.getItem("user_name") || "User";
        // const email = localStorage.getItem("user_email") || "";
        getProfile();
        //setProfile({ name, email });
    }, []);

    const selectedKeys = [location.pathname];
    if (location.pathname === '/calibrate-compass' || location.pathname === '/compass-details') {
        selectedKeys.push('/calibrate-compass');
    }
    else if (location.pathname === '/game-rank-report' || location.pathname === '/game-rank-details') {
        selectedKeys.push('/game-rank-report');
    }
    else if (location.pathname === '/game-provider-marketshare' || location.pathname === '/game-provider-marketshare-details') {
        selectedKeys.push('/game-provider-marketshare');
    }


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
                    {!collapsed && <span className="sidebar-logo-text">IGamingCompass</span>}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={selectedKeys}
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
