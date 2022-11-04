import { render, screen } from "@testing-library/react";
import App from "../App";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { store } from "store/store";
import "./mockEL";

window.scrollTo = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () =>
    jest.fn().mockReturnValue({
      pathname: "/",
      search: "",
      hash: "",
      state: null,
      key: "",
    }),
}));

const history = createMemoryHistory();

describe("Renders App", () => {
  beforeAll(async () => {
    await act(() => {
      render(
        <Provider store={store}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>
      );
    });
  });

  it("Homepage renders correctly", () => {
    expect(screen.getAllByText("Accounts").length).toBe(2);
  });
});
