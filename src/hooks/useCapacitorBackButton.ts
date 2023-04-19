import { App as CapApp } from "@capacitor/app";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useCapacitorBackButton = () => {
  const navigate = useNavigate();

  useEffect(() => {
    CapApp.addListener("backButton", () => {
      navigate(-1);
    });
  }, []);
};
