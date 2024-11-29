/* import { framer } from "framer-plugin"; */
/* import { useNavigate } from "react-router-dom"; */
import { useState, useCallback } from "react";
import AlertBlock, { AlertMessage } from "../AlertBlock/AlertBlock";
import EmbeddedCheckout from "./EmbeddedCheckout";
import "./style.css";

const PaySubscription = ({ framer, useNavigate }) => {
  const [alert, setAlert] = useState<AlertMessage | null>();
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

      <EmbeddedCheckout framer={framer} useNavigate={useNavigate} />

      <AlertBlock Alert={alert} setAlert={setAlert} />
    </main>
  );
};

export default PaySubscription;
