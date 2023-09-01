import { Menu } from "antd";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import {
  AppstoreOutlined,
  CoffeeOutlined,
  LoginOutlined,
  CarryOutOutlined,
  TeamOutlined,
  LogoutOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Context } from "../context";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
const { Item, SubMenu, ItemGroup } = Menu;
const TopNav = () => {
  const [current, setCurrent] = useState("");
  const { state, dispatch } = useContext(Context);
  const { user } = state;

  const router = useRouter();
  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);
  const logout = async () => {
    dispatch({ type: "LOGOUT" });
    window.localStorage.removeItem("user");
    const { data } = await axios.get("/api/logout");
    toast(data.message);
    router.push("/login");
  };

  return (
    <Menu 
    theme="dark"
    mode="horizontal" 
    selectedKeys={[current]} 
    className="nb-2"
    >
      <Item
        key="/"
        onClick={(e) => setCurrent(e.key)}
        icon={<AppstoreOutlined />}
      >
        <Link legacyBehavior href="/">
          <a> App</a>
        </Link>
      </Item>



      {user && user.role && user.role.includes("Instructor") ? (
        <Item
        key="/instructor/course/create"
        onClick={(e) => setCurrent(e.key)}
        icon={<CarryOutOutlined />}
      >
        <Link legacyBehavior href="/instructor/course/create">
          <a> Create Course</a>
        </Link>
      </Item>
        ):( 
          <Item
        key="/user/become-instructor"
        onClick={(e) => setCurrent(e.key)}
        icon={<TeamOutlined />}
      >
        <Link legacyBehavior href="/user/become-instructor">
          <a> Become Instructor</a>
        </Link>
      </Item>

        )};

        

        {user === null && (
        <>
          
          <Item
            key="/login"
            onClick={(e) => setCurrent(e.key)}
            icon={<LoginOutlined />}
          >
            <Link legacyBehavior href="/login">
              <a> Login</a>
            </Link>
          </Item>
        </>
      )}

      {user === null && (
        <>
          
          <Item
            key="/register"
            onClick={(e) => setCurrent(e.key)}
            icon={<UserAddOutlined />}
          >
            <Link legacyBehavior href="/register">
              <a> Register</a>
            </Link>
          </Item>
        </>
      )}
      {user !== null && (
        <SubMenu
          icon={<CoffeeOutlined />}
          title={user && user.name}
          className="float-right"
        >
          <ItemGroup>
            <Item key="/user">
              <Link legacyBehavior href="/user">
                <a> Dashboard</a>
              </Link>
            </Item>
            <Item onClick={logout} className="float-right">Logout
            </Item>
          </ItemGroup>
        </SubMenu>
      )};
      {user && user.role && user.role.includes("Instructor") && (
          <Item
          key="/instructor"
          onClick={(e) => setCurrent(e.key)}
          icon={<TeamOutlined />}
          className="float-right"
        >
          <Link legacyBehavior href="/instructor">
            <a> Instructor</a>
          </Link>
        </Item>          
        ) }
      
    </Menu>
  );
};
export default TopNav;
