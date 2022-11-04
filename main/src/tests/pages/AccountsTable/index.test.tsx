import { render, screen, fireEvent } from "@testing-library/react";
import Accounts from "pages/AccountsTable";
import { Provider } from "react-redux";
import { store } from "store/store";
import "../../mockEL";

describe("Page: Accounts", () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <Accounts />
      </Provider>
    );
  });

  it("Accounts Page title renders correctly", () => {
    expect(screen.getByText("Accounts")).toBeInTheDocument();
  });

  describe("Datatable Filter feature", () => {
    it("Filter Input renders", () => {
      const filterInput = screen.getByPlaceholderText(/filter by attributes/i);
      expect(filterInput).toBeInTheDocument();
    });

    it("Filter Input default value", () => {
      const filterInput: HTMLInputElement =
        screen.getByPlaceholderText(/filter by attributes/i);
      expect(filterInput.value).toBe("");
    });

    it("Filter value must change with Input", () => {
      const filterInput = screen.getByPlaceholderText(
        /filter by attributes/i
      ) as HTMLInputElement;
      fireEvent.change(filterInput, { target: { value: "aws" } });
      expect(filterInput.value).toBe("aws");
    });
  });
});
