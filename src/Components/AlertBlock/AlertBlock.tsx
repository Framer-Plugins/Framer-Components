import React, { useState } from "react";
import "./style.css";

export interface AlertMessage {
  message: string;
  type: "success" | "warning" | "info" | "error";
  time: number | null | undefined;
}

export interface AlertInterface {
  Alert: AlertMessage | null | undefined;
  setAlert: React.Dispatch<
    React.SetStateAction<AlertMessage | null | undefined>
  >;
}

const AlertBlock = ({ Alert, setAlert }: AlertInterface) => {

  console.log(React);
  console.log(useState);
  if (!Alert) return null;
  if (!Alert.message) return null;

  let [ClassBlock, SetClassBlock] = useState<string>("alert-block");

  const CloseAlert = () => {
    SetClassBlock("alert-block alert-block-hide");
    window.setTimeout(() => {
      setAlert(null);
    }, 500);
  };

  if (Alert.time) {
    setTimeout(() => {
      CloseAlert();
    }, Alert.time);
  } else {
    setTimeout(() => {
      CloseAlert();
    }, 10000);
  }

  return (
    <div className={Alert.type + "-block " + ClassBlock}>
      <i onClick={() => CloseAlert()} className="fa fa-lg fa-close"></i>
      <h4>{Alert.type.toUpperCase()}</h4>
      <p>{Alert.message}</p>
    </div>
  );
};

export default AlertBlock;
