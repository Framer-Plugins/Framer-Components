import { framer } from "framer-plugin";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AlertBlock, { AlertMessage } from "../AlertBlock/AlertBlock";
import EmbeddedCheckout from "./EmbeddedCheckout";
import "./style.css";

const MyComponent = () => {
  const [alert, setAlert] = useState<AlertMessage | null>();
  const [loading, setLoading] = useState<boolean>();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    const pluginKeys = [
      "UserEmail",
      "UserID",
      "UserToken",
      "UserIsSubscribed",
      "UserSubscribtionDate",
      "UserExpiresIn",
      "UserSubscribtionCancelDate",
      "open-ai-model",
      "open-ai-size",
      "open-ai-key",
    ];

    await Promise.all(pluginKeys.map((key) => framer.setPluginData(key, null)));
    navigate("/StartPage");
  }, [navigate]);

  return (
    <main id="PaySubscription">
      <button className="button-back" onClick={handleLogout}>
        <i className="fa fa-lg fa-angle-left"></i>
        Logout
      </button>
      <p className="text-center">subscribe to all our plugins</p>

      <EmbeddedCheckout />

      <AlertBlock Alert={alert} setAlert={setAlert} />
    </main>
  );
};

export default MyComponent;
