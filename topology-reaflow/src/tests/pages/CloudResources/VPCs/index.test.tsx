import { render, screen, fireEvent } from "@testing-library/react";
import VPCs from "pages/CloudResources/VPCs";
import "../../../mockEL";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () =>
    jest.fn().mockReturnValue({
      pathname: "/vpcs",
    }),
}));

describe("Page: VPCs", () => {
  beforeEach(() => {
    render(<VPCs />);
  });

  it("VPCs page title renders correctly", () => {
    expect(screen.getByText("VPCs in")).toBeInTheDocument();
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
