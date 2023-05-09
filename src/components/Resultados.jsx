import React from "react";
import { useAuthStore } from "../hooks/useAuthStore";

export default function Resultados({ parentToChild }) {
  const { startUpdate, getRegistros } = useAuthStore();

  return <div>{parentToChild}</div>;
}
