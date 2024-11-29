/* import { framer } from "framer-plugin"; */
/* import { useNavigate } from "react-router-dom"; */
import { StripePublishableKey } from "../../utils/keys";
import { useEffect, useState, useCallback } from "react";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AlertBlock, { AlertMessage } from "../AlertBlock/AlertBlock";
import axios from "axios";

const EmbeddedCheckoutComponent = ({
  framer,
  useNavigate,
}) => {
  const StripeLoad = loadStripe(StripePublishableKey);
  const [alert, setAlert] = useState<AlertMessage | null | undefined>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  const handleComplete = async () => {
    setIsComplete(true);
    let UserID = await framer.getPluginData("UserID");
    let count = 0;
    const intervalID = setInterval(async () => {
      count++;

      let user = await axios.get(
        `https://zeroqodeplugins.bubbleapps.io/version-test/api/1.1/obj/User/${UserID}`
      );
      if (user.data.response) {
        await framer.setPluginData(
          "UserSubscribtionID",
          user.data.response["subscription ID"]
        );
        await framer.setPluginData(
          "UserIsSubscribed",
          user.data.response["is subscribed?"].toString()
        );
        await framer.setPluginData(
          "UserSubscribtionDate",
          user.data.response["subscription date"]
        );
        await framer.setPluginData(
          "UserSubscribtionCancelDate",
          user.data.response["subscription cancel date"] ?? ""
        );
        if (user.data.response["is subscribed?"]) {
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
