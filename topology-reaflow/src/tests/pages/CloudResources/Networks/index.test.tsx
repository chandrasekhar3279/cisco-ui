import { fireEvent, render, screen } from "@testing-library/react";
import NetworkServices from "pages/CloudResources/Networks";
import "../../../mockEL";

describe("Networks Screen checking", () => {
  beforeEach(() => {
    render(<NetworkServices />);
  });

  it("Networks page title renders correctly", () => {
    expect(screen.getByText("Networks")).toBeInTheDocument();
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
