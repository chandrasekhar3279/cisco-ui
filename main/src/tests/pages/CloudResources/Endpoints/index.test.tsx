import { fireEvent, render, screen } from "@testing-library/react";
import Endpoints from "pages/CloudResources/Endpoints";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () =>
    jest.fn().mockReturnValue({
      pathname: "/endpoints",
    }),
}));

describe("Page: Endpoints", () => {
  beforeEach(() => {
    render(<Endpoints />);
  });

  it("Component: Endpoints renders correctly", () => {
    expect(screen.getByText("Endpoints in")).toBeInTheDocument();
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
