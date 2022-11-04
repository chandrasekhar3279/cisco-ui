import { useEffect, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import Navigation from "../components/Navigation";
import NavBar from "../components/NavBar";
import Breadcrumb from "../components/Breadcrumb";
import Loader from "../components/Loader";
import routes from "../routes";
import * as actionTypes from "../store/actions";
import { useSelector } from "react-redux";
import useWindowSize from "../hooks/useWindowSize";

const Layout = () => {
  const { windowWidth } = useWindowSize();
  const dispatch = useDispatch();
  const defaultPath = useSelector((state: any) => state.able.defaultPath);
  const collapseMenu = useSelector((state: any) => state.able.collapseMenu);
  const layout = useSelector((state: any) => state.able.layout);
  const subLayout = useSelector((state: any) => state.able.subLayout);

  useEffect(() => {
    if (windowWidth > 992 && windowWidth <= 1024 && layout !== "horizontal") {
      dispatch({ type: actionTypes.COLLAPSE_MENU });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mobileOutClickHandler = () => {
    if (windowWidth < 992 && collapseMenu) {
      dispatch({ type: actionTypes.COLLAPSE_MENU });
    }
  };

  let mainClass = ["pcoded-wrapper"];

  if (layout === "horizontal" && subLayout === "horizontal-2") {
    mainClass = [...mainClass, "container"];
  }

  return (
    <>
      <Navigation />
      <NavBar />
      <div
        className="pcoded-main-container"
        onClick={() => mobileOutClickHandler}
      >
        <div className={mainClass.join(" ")}>
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <Breadcrumb />
              <div className="main-body">
                <div className="page-wrapper">
                  <Suspense fallback={<Loader />}>
                    <Switch>
                      {routes.map((route: any, index) => {
                        return route.component ? (
                          <Route
                            key={index}
                            path={route.path}
                            exact={route.exact}
                            render={(props) => <route.component {...props} />}
                          />
                        ) : null;
                      })}
                      <Redirect from="/" to={defaultPath} />
                    </Switch>
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Layout;
