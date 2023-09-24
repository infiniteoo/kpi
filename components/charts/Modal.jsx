import React from "react";

const Modal = ({ children, onClose }) => {
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalStyle = {
    width: "80%",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    position: "relative",
  };

  const closeButtonStyle = {
    position: "absolute",
    right: "10px",
    top: "10px",
    cursor: "pointer",
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <span style={closeButtonStyle} onClick={onClose}>
          X
        </span>
        {children}
      </div>
    </div>
  );
};

export default Modal;
