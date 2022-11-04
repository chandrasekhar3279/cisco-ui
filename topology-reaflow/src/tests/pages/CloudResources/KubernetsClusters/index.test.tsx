import { fireEvent, render, screen } from "@testing-library/react";
import KubernetesClusters from "pages/CloudResources/KubernetesClusters";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () =>
    jest.fn().mockReturnValue({
      pathname: "/kubernetes-clusters",
    }),
}));

describe("Page: Kubernetes Clusters", () => {
  beforeEach(() => {
    render(<KubernetesClusters />);
  });

  it("Kubernetes Clusters page title renders correctly", () => {
    expect(screen.getByText("Kubernetes Clusters in")).toBeInTheDocument();
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
