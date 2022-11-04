import * as React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop(props: { children: any }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{props.children || null}</>;
}

export default ScrollToTop;
