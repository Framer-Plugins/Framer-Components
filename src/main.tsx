
/* export { default as AlertBlock } from "./Components/AlertBlock/AlertBlock"; */
/* export type { AlertMessage } from "./Components/AlertBlock/AlertBlock"; */
/* export { default as SignIn } from "./Components/SignIn/SignIn";
export { default as SignUp } from "./Components/SignUp/SignUp";
 */

import React from "react";
import ReactDOM from "react-dom";
import AlertBlock from "./Components/AlertBlock/AlertBlock";
import type AlertMessage from "./Components/AlertBlock/AlertBlock";

const PNIReact = React;
const PNIReactDOM = ReactDOM;

export default {
  PNIReact,
  PNIReactDOM,
  AlertBlock,
}

export type {AlertMessage}
