import type { PlasmoRender, PlasmoGetStyle, PlasmoGetInlineAnchorList, PlasmoMountShadowHost, PlasmoWatchOverlayAnchor, PlasmoCSUIJSXContainer } from "plasmo";
import React from "react";
import { createRoot } from "react-dom/client"
import Popup from 'reactjs-popup';
import { sendToBackground } from "@plasmohq/messaging";
import styled from 'styled-components';


const Tooltip = styled(Popup)`
  &-content {
    margin: auto;
    transition: opacity 0.8s;
    font-weight: normal;
    font-size: 13px;
    min-width: 200px;
    max-width: 500px;
    padding: 20px 20px;
    color: #444444;
    background-color: #eeeeee;
    border-radius: 4px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.2);
  }
  &-arrow {
    color: #eeeeee;
  }

  @media screen and (prefers-color-scheme: dark) {
    &-content {
      color: #aaaaaa;
      background-color: #444444;
      box-shadow: 0 1px 8px rgba(255, 255, 255, 0.2);
    }
    &-arrow {
      color: #444444;
    }
  }
`

export default Tooltip