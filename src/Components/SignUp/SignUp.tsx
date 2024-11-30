/* import { framer } from "framer-plugin";
import { useNavigate } from "react-router-dom"; */
import React, { useState } from "react";
import AlertBlock, { AlertMessage } from "../AlertBlock/AlertBlock";
import axios from "axios";
import "./style.css";
import { API_BASE_URL } from "../../utils/keys";

const MyComponent = ({ framer, useNavigate }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [alert, setAlert] = useState<AlertMessage | null>();
  const [loading, setLoading] = useState<boolean>();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignUp = async () => {
    setLoading(true);
    if (!email || !password || !confirmPassword) {
      setAlert({ message: "Some fields blank", type: "error", time: null });
      setLoading(false);
      return;
    } else if (password != confirmPassword) {
      setAlert({ message: "Passwords don't match", type: "error", time: null });
      setLoading(false);
      return;
    } else if (!validateEmail(email)) {
      setAlert({ message: "Email is not correct", type: "error", time: null });
      setLoading(false);
      return;
    }

    let data = {
      email,
      password,
      confirmPassword,
    };
    axios
      .post(
        `${API_BASE_URL}/sign_up`,
        data
      )
      .then(async (res) => {
        if (res.data.status === "success") {
          await framer.setPluginData("UserEmail", email);
          await framer.setPluginData("UserID", res.data.response.user_id);
          await framer.setPluginData("UserToken", res.data.response.token);
          await framer.setPluginData(
            "UserIsSubscribed",
            res.data.response["is subscribed?"].toString()
          );
          let seconds_now = Math.floor(Date.now() / 1000);
          let tokenValidTimestamp = seconds_now + res.data.response.expires;
          await framer.setPluginData(
            "UserExpiresIn",
            tokenValidTimestamp.toString()
          );
          setAlert(null);
          setLoading(false);

          if (res.data.response["is subscribed?"]) {
            console.log("");
          } else {
            navigate("/PaySubscription");
          }
        }
      })
      .catch((error) => {
        setAlert({
          message: JSON.stringify(error?.response?.data?.message),
          type: "error",
          time: null,
        });
        setLoading(false);
      });
  };

  const handleSignIn = async () => {
    navigate("/SignIn");
  };

  return (
    <main id="SignUp">
      <button className="button-back" onClick={() => navigate(-1)}>
        <i className="fa fa-lg fa-angle-left"></i>
        Back
      </button>
      <h2>Account Register</h2>
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
      <input
        className="input-text"
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button
        disabled={loading}
        className="framer-button-primary"
        onClick={handleSignUp}
      >
        {loading ? "Loading" : "Sign Up"}
      </button>
      <div className="div-row">
        <span onClick={handleSignIn}>Already have an account?</span>
      </div>
      <AlertBlock Alert={alert} setAlert={setAlert} />
    </main>
  );
};

export default MyComponent;
