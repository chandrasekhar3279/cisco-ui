import { fireEvent, render, screen } from "@testing-library/react";
import SecurityGroups from "pages/CloudResources/SecurityGroups";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () =>
    jest.fn().mockReturnValue({
      pathname: "/securitygroups",
    }),
}));

describe("Page: Security Groups", () => {
  beforeEach(() => {
    render(<SecurityGroups />);
  });

  it("Security Groups page title renders correctly", () => {
    expect(screen.getByText("Security Groups in")).toBeInTheDocument();
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
