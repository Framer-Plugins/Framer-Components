/* import { framer } from "framer-plugin"; */
/* import { useNavigate } from "react-router-dom"; */
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { StripePublishableKey } from "../../utils/keys";
import AlertBlock, { AlertMessage } from "../AlertBlock/AlertBlock";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const EmbeddedCheckoutComponent = ({ framer, useNavigate }) => {
  const StripeLoad = loadStripe(StripePublishableKey);
  const [alert, setAlert] = useState<AlertMessage | null | undefined>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  const handleComplete = async () => {
    setIsComplete(true);
    console.log("true")
    let UserEmail = await framer.getPluginData("UserEmail");

    let count = 0;
    const intervalID = setInterval(async () => {
      count++;

      let data = {
        email: UserEmail,
        subscriptionID: await framer.getPluginData("UserSubscribtionID"),
      };
      let user = await axios.post(
        `https://zeroqodeplugins.bubbleapps.io/version-test/api/1.1/wf/check user`,
        data
      );
      if (user.data.response) {
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

        if (user.data.response.User["is subscribed?"]) {
          clearInterval(intervalID);
          navigate("/");
        }
      }
      if (count === 10) {
        clearInterval(intervalID);
        framer.closePlugin();
      }
    }, 1500);
  };

  const fetchClientSecret = useCallback(async () => {
    return axios
      .post(
        "https://zeroqodeplugins.bubbleapps.io/version-test/api/1.1/wf/stripe create a session/",
        {
          customer_email: await framer.getPluginData("UserEmail"),
        }
      )
      .then((response) => {
        if (response.data.response.client_secret) {
          setClientSecret(response.data.response.client_secret);
        } else {
          console.log(response);
          setAlert({
            message: "Temporary error, come back later please...",
            type: "error",
            time: 2000,
          });
          throw new Error("Client secret not found in response");
        }
      });
  }, []);

  useEffect(() => {
    fetchClientSecret();
  }, [fetchClientSecret]);

  if (!clientSecret || isComplete) {
    return (
      <div>
        <div className="loading-div">
          <div className="loader"></div>
        </div>
        <AlertBlock Alert={alert} setAlert={setAlert} />
      </div>
    );
  }

  const options = {
    clientSecret,
    onComplete: handleComplete,
  };
  return (
    <div id="checkout" className="mt-3">
      <EmbeddedCheckoutProvider stripe={StripeLoad} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
      <AlertBlock Alert={alert} setAlert={setAlert} />
    </div>
  );
};

export default EmbeddedCheckoutComponent;
