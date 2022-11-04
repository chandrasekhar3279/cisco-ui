import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Loader from "./components/Loader";
import routes from "./routes";
import ScrollToTop from "./hooks/ScrollToTop";
const Layout = lazy(() => import("./layout"));

const App = () => {
  return (
    <>
      <ScrollToTop>
        <Suspense fallback={<Loader />}>
          <Route path={routes.map((x) => x.path)}>
            <Layout />
          </Route>
        </Suspense>
      </ScrollToTop>
      <div className="backdrop" />
    </>
  );
};
export default App;
