/**
 * ModalPortal
 * Renders full-screen overlays on document.body so they cover the whole
 * viewport. Inside the dashboard, page wrappers use transforms/animations,
 * which would otherwise trap `position: fixed` children to the content area.
 */

import { createPortal } from "react-dom";

const ModalPortal = ({ children }) =>
  typeof document === "undefined"
    ? null
    : createPortal(children, document.body);

export default ModalPortal;
