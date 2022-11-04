import * as React from "react";
import { useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import * as actionTypes from "../../../store/actions";
import { useSelector } from "react-redux";
import useWindowSize from "../../../hooks/useWindowSize";

const OutsideClick = (props: {
  children:
    | boolean
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
}) => {
  const wrapperRef: any = useRef(null);
  const dispatch = useDispatch();
  const collapseMenu = useSelector((state: any) => state.able.collapseMenu);
  const onToggleNavigation = useCallback(
    () => dispatch({ type: actionTypes.COLLAPSE_MENU }),
    [dispatch]
  );
  const { windowWidth } = useWindowSize();

  useEffect(() => {
    function handleClickOutside(event: { target: any }) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        if (windowWidth < 992 && collapseMenu) {
          onToggleNavigation();
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, collapseMenu, windowWidth, onToggleNavigation]);
  return (
    <div className="nav-outside" ref={wrapperRef}>
      {props.children}
    </div>
  );
};
export default OutsideClick;
