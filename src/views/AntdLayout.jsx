import { useContext, useState, useEffect } from "react";
import user1 from "../assets/images/users/user4.jpg";
import logo from "../assets/images/logos/logo.png";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./AntdLayout.css";
import { FaChartLine, FaChartPie, FaHouse, FaRegStar, FaRegUser, FaBoltLightning, FaMapLocationDot } from "react-icons/fa6";
import { FaCompass } from "react-icons/fa6";
import { GiPositionMarker, GiCardPickup } from "react-icons/gi";
import { FaRankingStar } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { MdCasino } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import profileService from "../services/Profile";
import { ProfileSystem } from "../context/ProfileContext";
import { IoMdHelp } from "react-icons/io";
import toast from "react-hot-toast";
import { setIn } from "formik";

const { Header, Sider, Content } = Layout;

const AppLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const [profile, setProfile] = useState({});

    const user_id = localStorage.getItem("user_id");
    const user_company_category = localStorage.getItem("user_company_category");

    const { dispatch } = useContext(ProfileSystem);

    const toggle = () => setCollapsed(!collapsed);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const menuItems = user_company_category === "Operator" || user_company_category === "Aggregator" ? [
        {
            key: "/",
            icon: <FaHouse />,
            label: "Home",
        },
        {
            key: "dataview",
            label: "Data View",
            icon: <FaChartLine />,
            children: [
                {
                    key: "/competitor-dashboard",
                    icon: <MdCasino />,
                    label: "Provider Comparison",
                },
                {
                    key: "/casino-view",
                    icon: <MdDashboard />,
                    label: "View Operator Data",
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
    ] : [
        {
            key: "/",
            icon: <FaHouse />,
            label: "Home",
        },
        {
            key: "dashboard",
            icon: <GiPositionMarker />,
            label: "Positions Dashboard",
            children: [
                {
                    key: "/country-dashboard",
                    icon: <FaMapLocationDot />,
                    label: "Country Dashboard",
                },
                {
                    key: "/operator-dashboard",
                    icon: <MdCasino />,
                    label: "Operator Dashboard",
                },
                {
                    key: "/game-dashboard",
                    icon: <GiCardPickup />,
                    label: "Games Dashboard",
                },
                {
                    key: "/dashboard",
                    icon: <FaBoltLightning />,
                    label: "Quick Access",
                }
            ],
        },
        {
            key: "/calibrate-compass",
            icon: <FaCompass />,
            label: "Calibrate Compass",
        },
        {
            key: "dataview",
            label: "Data View",
            icon: <FaChartLine />,
            children: [
                {
                    key: "/competitor-dashboard",
                    icon: <MdCasino />,
                    label: "Provider Comparison",
                },
                {
                    key: "/casino-view",
                    icon: <MdDashboard />,
                    label: "View Operator Data",
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

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        setLoading(true);
        try {
            // const response = await profileService.Profile({
            //     user_id: parseInt(user_id),
            // });

            // if (response?.success) {
            //     setProfile(response?.data);
            // }
            console.log("User input:", input);
        } catch (err) {
            console.error(err);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
            setInput("");
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
    else if (location.pathname === '/dashboard' || location.pathname === '/position-details') {
        selectedKeys.push('/dashboard');
    }


    return (

        <Layout style={{
            marginLeft: collapsed ? 80 : 250,
            marginRight: chatOpen ? 360 : 0,
            transition: "margin-left 0.2s"
        }}>
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

            {chatOpen && (
                <Sider
                    width={360}
                    theme="light"
                    style={{
                        position: "fixed",
                        right: 0,
                        top: 0,
                        bottom: 0,
                        zIndex: 1100,
                        borderLeft: "1px solid #e5e5e5",
                        background: "#eeeeee",
                    }}
                >
                    <div
                        style={{
                            padding: 12,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div className="bol" style={{ fontSize: "20px", fontWeight: 600, marginBottom: 12, color: "#392f6c" }}>
                            AI Insights
                        </div>

                        <div
                            style={{
                                flex: 1,
                                overflowY: "auto",
                                paddingRight: 6,
                                marginBottom: 12,
                            }}
                        >

                            {/* Chat messages */}
                            <div
                                style={{
                                    flex: 1,
                                    overflowY: "auto",
                                    height: "calc(100% - 80px)",
                                    paddingRight: 6,
                                }}
                            >
                                {/* AI Message */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        marginBottom: 12,
                                    }}
                                >
                                    <div
                                        style={{
                                            maxWidth: "80%",
                                            background: "#ffffffcc",
                                            padding: "10px 14px",
                                            borderRadius: "12px 12px 12px 4px",
                                            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                            color: "#2f2f2f",
                                            fontSize: "14px",
                                        }}
                                    >
                                        👋 Hi Akshay! How can I help you?
                                    </div>
                                </div>

                                {/* User Message */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        marginBottom: 12,
                                    }}
                                >
                                    <div
                                        style={{
                                            maxWidth: "80%",
                                            padding: "10px 14px",
                                            borderRadius: "12px 12px 4px 12px",
                                            background: "linear-gradient(135deg, #7F7BFF, #9A8CFF, #B59CFF)",
                                            color: "#ffffff",
                                            fontWeight: 500,
                                            fontSize: "14px",
                                            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                        }}
                                    >
                                        Show me insights for today’s game positions.
                                    </div>
                                </div>
                            </div>

                        </div>

                        {loading && (
                            <div style={{ marginBottom: 10 }}>
                                <div
                                    style={{
                                        fontSize: "12px",
                                        fontWeight: 500,
                                        color: "#392f6c",
                                        marginBottom: 6,
                                    }}
                                >
                                    Analyzing data…
                                </div>

                                <div
                                    style={{
                                        height: 6,
                                        width: "100%",
                                        borderRadius: 999,
                                        background: "#ddd",
                                        overflow: "hidden",
                                        position: "relative",
                                    }}
                                >
                                    <div
                                        style={{
                                            height: "100%",
                                            width: "40%",
                                            borderRadius: 999,
                                            background: "linear-gradient(135deg, #7F7BFF, #9A8CFF, #B59CFF)",
                                            animation: "chat-loading 1.2s ease-in-out infinite",
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: 12 }}>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask whatever you want..."
                                style={{
                                    width: "100%",
                                    padding: "8px 10px",
                                    borderRadius: 6,
                                    border: "1px solid #392f6c",
                                }}
                            />
                        </div>
                    </div>
                </Sider>
            )}


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
                    {/* <Outlet /> */}
                    <Outlet context={{
                        toggleChat: () => {
                            setChatOpen(prev => {
                                const next = !prev;
                                if (next) setCollapsed(true);
                                return next;
                            });
                        },
                        closeChat: () => setChatOpen(false),
                        isChatOpen: chatOpen,
                    }} />

                </Content>
            </Layout>
        </Layout>
    );
};

export default AppLayout;
