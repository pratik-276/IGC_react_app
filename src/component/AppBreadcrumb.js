import { BreadCrumb } from "primereact/breadcrumb";
import { useLocation, useNavigate } from "react-router-dom";

const breadcrumbNameMap = {
  dashboard: "Dashboard",
  "game-provider-marketshare": "Provider Marketshare",
  "game-provider-marketshare-details": "Provider Details",
  reports: "Reports",
  settings: "Settings",
};

export default function AppBreadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split("/").filter((x) => x);

  const items = pathnames.map((segment, index) => {
    const routeTo = "/" + pathnames.slice(0, index + 1).join("/");

    const label =
      breadcrumbNameMap[segment] ||
      segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

    return {
      label,
      command:
        index !== pathnames.length - 1 ? () => navigate(routeTo) : undefined,
    };
  });

  const home = {
    icon: "pi pi-home",
    command: () => navigate("/"),
  };

  return <BreadCrumb model={items} home={home} />;
}
