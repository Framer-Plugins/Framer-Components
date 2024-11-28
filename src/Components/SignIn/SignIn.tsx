/* import { framer } from "framer-plugin"; */
import { useState } from "react";
/* import { useNavigate } from "react-router-dom"; */
import AlertBlock, { AlertMessage } from "../AlertBlock/AlertBlock";
import axios from "axios";
import "./style.css";

const API_BASE_URL =
  "https://zeroqodeplugins.bubbleapps.io/version-test/api/1.1/wf";

const SignIn = (framer, useNavigate) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertMessage | null | undefined>(null);
  const navigate = useNavigate();

  const showError = (message: string) => {
    setAlert({ message, type: "error", time: null });
    setLoading(false);
  };

  const handleApiRequest = async (
    endpoint: string,
    data: Record<string, any>,
    onSuccess: (res: any) => void
  ) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/${endpoint}`, data);
      if (res.data.status === "success") {
        onSuccess(res);
      } else {
        showError("Unexpected API response.");
      }
    } catch (error: any) {
      showError(error?.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      showError("Some fields are blank");
      return;
    }

    setLoading(true);

    const data = { email, password };

    await handleApiRequest("sign_in", data, async (res) => {
      const response = res.data.response;
      const secondsNow = Math.floor(Date.now() / 1000);
      const tokenValidTimestamp = secondsNow + response.expires;

      await Promise.all([
        framer.setPluginData("UserEmail", email),
        framer.setPluginData("UserID", response.user_id),
        framer.setPluginData("UserToken", response.token),
        framer.setPluginData(
          "UserIsSubscribed",
          response["is subscribed?"].toString()
        ),
        framer.setPluginData("UserExpiresIn", tokenValidTimestamp.toString()),
        framer.setPluginData(
          "UserSubscribtionID",
          response["subscription ID"] || ""
        ),
        framer.setPluginData(
          "UserSubscribtionDate",
          response["subscription date"].toString() || ""
        ),
      ]);

      setAlert(null);

      navigate(response["is subscribed?"] ? "/PluginWork" : "/PaySubscription");
    });
  };

  const handleSignUp = () => navigate("/SignUp");

  const handleForgotPass = async () => {
    if (!email) {
      showError("Please enter your email");
      return;
    }

    setLoading(true);

    const data = { email };

    await handleApiRequest("forgot_password", data, () => {
      setAlert({
        message: "The password reset email has been sent to your inbox.",
        type: "info",
        time: 2000,
      });
    });
  };

  return (
    <main id="SignIn">
      <button className="button-back" onClick={() => navigate(-1)}>
        <i className="fa fa-lg fa-angle-left"></i>
        Back
      </button>
      <h2>Account Login</h2>
      <input
        className="input-text"
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="input-text"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="framer-button-primary"
        onClick={handleSignIn}
        disabled={loading}
      >
        {loading ? "Loading..." : "Login"}
      </button>
      <div className="div-row">
        <span onClick={handleSignUp}>Don't have an account?</span>
        <span onClick={handleForgotPass}>Forgot password?</span>
      </div>
      <AlertBlock Alert={alert} setAlert={setAlert} />
    </main>
  );
};

export default SignIn;
