import React from "react";

export default function ErrorMessage({ message }) {
  return <p style={{ color: "red", marginTop: "10px" }}>{message}</p>;
}