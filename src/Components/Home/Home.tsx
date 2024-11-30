/* import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"; */
/* import { framer } from "framer-plugin"; */
import { useEffect } from "react";
import "./style.css";
import axios from "axios";
import React from "react";
import { API_BASE_URL } from "../../utils/keys";

interface NavButtonProps {
  activeTab: boolean;
  icon: string;
  iconSVG?: React.ReactNode;
}

const NavButton = ({ activeTab, icon, iconSVG }: NavButtonProps) => (
  <button className={`tab-buttons ${activeTab ? "active" : ""}`}>
    <i className={icon}>{iconSVG}</i>
  </button>
);

function Home({ framer, Link, Outlet, useLocation, useNavigate}) {

  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      let UserEmail = await framer.getPluginData("UserEmail");
      /* `https://zeroqodeplugins.bubbleapps.io/version-test/api/1.1/obj/User/${UserID}` */
      if (UserEmail) {
        let data = {
          email: UserEmail,
          subscriptionID: await framer.getPluginData("UserSubscribtionID"),
        };
        let user = await axios.post(
          `${API_BASE_URL}/check user`,
          data
        );
        if (user.data.response) {
          /* await framer.setPluginData(
            "UserSubscribtionID",
            user.data.response.User["subscription ID"] ?? ""
          ); */
          await framer.setPluginData(
            "UserIsSubscribed",
            user.data.response.User["is subscribed?"]
              ? user.data.response.User["is subscribed?"].toString()
              : "false"
          );
          await framer.setPluginData(
            "UserSubscribtionDate",
            user.data.response.User["subscription date"]
              ? user.data.response.User["subscription date"].toString()
              : ""
          );
          await framer.setPluginData(
            "UserSubscribtionCancelDate",
            user.data.response.User["subscription cancel date"] ?? ""
          );
        }
      }
      let UserIsSubscribed = await framer.getPluginData("UserIsSubscribed");

      if (UserIsSubscribed != "true" && UserEmail) {
        navigate("/PaySubscription");
        return;
      } else if (UserIsSubscribed != "true" && !UserEmail) {
        navigate("/StartPage");
        return;
      }
    };
    checkUser();
  });

  let location = useLocation().pathname;
  return (
    <main>
      <nav className="tabs">
        <Link to="/PluginWork">
          <NavButton
            activeTab={location.includes("PluginWork")}
            icon="fa fa-lg fa-home"
          />
        </Link>
        <Link to="/Settings">
          <NavButton
            activeTab={location == "/Settings"}
            icon="fa fa-lg fa-cog"
          />
        </Link>
        <Link to="/Zeroqode">
          <NavButton
            activeTab={location == "/Zeroqode"}
            icon="fa fa-lg"
            iconSVG={
              <svg
                width="1.2em"
                viewBox="0 0 45 45"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.62 45C10.15 45 0 34.9731 0 22.8253V22.2228C0 9.95445 10.15 0 22.4992 0C34.8726 0 44.9985 9.95445 44.9985 22.1746V22.7772C45.1435 34.9972 34.9934 45 22.62 45Z"
                  fill="#1AAFD0"
                />
                <path
                  d="M21.9219 26.4651C21.4627 27.2845 21.7527 28.3451 22.526 28.779C22.816 28.8511 23.0577 29.0682 23.3477 29.0682C23.8794 29.0682 24.5078 28.779 24.7736 28.2488L33.9327 12.9916C34.2227 12.6301 34.2953 12.2926 34.2953 11.8347C34.2953 10.6054 33.3285 9.61719 32.0719 9.61719H14.261C13.3668 9.61719 12.7627 10.3162 12.7627 11.1116C12.7627 12.0034 13.4635 12.606 14.261 12.606H24.0244C25.9094 12.606 27.5044 14.1003 27.5044 15.9804C27.5044 16.5829 27.3352 17.2096 26.9728 17.8604L21.9219 26.4651Z"
                  fill="white"
                />
                <path
                  opacity="0.7"
                  d="M32.3154 34.3452C32.7746 33.5258 32.6054 32.4652 31.7838 32.0314C31.4938 31.8626 31.1796 31.7422 30.8896 31.7422L21.1263 31.8144C19.2413 31.8144 17.6463 30.3202 17.6463 28.4402C17.6463 27.8376 17.8155 27.2108 18.178 26.56L23.0838 18.2446C23.5429 17.5456 23.3738 16.5574 22.5522 16.0271C21.8513 15.5692 20.8605 15.7379 20.3288 16.5574C20.3288 16.6297 20.2563 16.6297 20.2563 16.6297L11.2663 31.959C10.6621 33.0196 10.9763 34.3452 11.9671 34.972H12.0396C12.4021 35.1407 12.7405 35.2612 13.1996 35.2612L30.9138 35.1888C31.4454 35.2371 32.0496 34.8754 32.3154 34.3452Z"
                  fill="white"
                />
                <path
                  d="M22.62 45C10.15 45 0 34.9731 0 22.8253V22.2228C0 9.95445 10.15 0 22.4992 0C34.8726 0 44.9985 9.95445 44.9985 22.1746V22.7772C45.1435 34.9972 34.9934 45 22.62 45Z"
                  fill="#1AAFD0"
                />
                <path
                  d="M21.9219 26.4651C21.4627 27.2845 21.7527 28.3451 22.526 28.779C22.816 28.8511 23.0577 29.0682 23.3477 29.0682C23.8794 29.0682 24.5078 28.779 24.7736 28.2488L33.9327 12.9916C34.2227 12.6301 34.2953 12.2926 34.2953 11.8347C34.2953 10.6054 33.3285 9.61719 32.0719 9.61719H14.261C13.3668 9.61719 12.7627 10.3162 12.7627 11.1116C12.7627 12.0034 13.4635 12.606 14.261 12.606H24.0244C25.9094 12.606 27.5044 14.1003 27.5044 15.9804C27.5044 16.5829 27.3352 17.2096 26.9728 17.8604L21.9219 26.4651Z"
                  fill="white"
                />
                <path
                  opacity="0.7"
                  d="M32.3154 34.3452C32.7746 33.5258 32.6054 32.4652 31.7838 32.0314C31.4938 31.8626 31.1796 31.7422 30.8896 31.7422L21.1263 31.8144C19.2413 31.8144 17.6463 30.3202 17.6463 28.4402C17.6463 27.8376 17.8155 27.2108 18.178 26.56L23.0838 18.2446C23.5429 17.5456 23.3738 16.5574 22.5522 16.0271C21.8513 15.5692 20.8605 15.7379 20.3288 16.5574C20.3288 16.6297 20.2563 16.6297 20.2563 16.6297L11.2663 31.959C10.6621 33.0196 10.9763 34.3452 11.9671 34.972H12.0396C12.4021 35.1407 12.7405 35.2612 13.1996 35.2612L30.9138 35.1888C31.4454 35.2371 32.0496 34.8754 32.3154 34.3452Z"
                  fill="white"
                />
              </svg>
            }
          />
        </Link>
      </nav>
      <Outlet />
    </main>
  );
}

export default Home;
