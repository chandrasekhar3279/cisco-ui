import { useEffect } from "react";

const CustomDialog = ({
  open,
  children,
}: {
  open?: boolean;
  children?: any;
}) => {
  useEffect(() => {
    document.getElementById("root").style.display = open ? "none" : "block";
  }, [open]);

  useEffect(() => {
    return () => {
      document.getElementById("root").style.display = "block";
    };
  }, []);

  return open && children;
};

export default CustomDialog;
