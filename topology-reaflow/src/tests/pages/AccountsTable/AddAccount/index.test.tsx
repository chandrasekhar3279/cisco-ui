import { render, screen } from "@testing-library/react";
import AddAccount from "pages/AccountsTable/AddAccount";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { store } from "store/store";

const reRenderAfterPopup = jest.fn();

describe("Component:  Add Account", () => {
  beforeEach(() => {
    act(() => {
      render(
        <Provider store={store}>
          <AddAccount reRenderAfterPopup={reRenderAfterPopup} />
        </Provider>
      );
    });
  });

  it("Add Account Dialog renders properly", () => {
    expect(screen.getByText("Let's get started")).toBeInTheDocument();
  });
});
