import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "store/store";
import SelectProvider from "pages/AccountsTable/AddAccount/Select-Provider";
import { StepContainer } from "components/Steps";

describe("Step 1: SelectProvider", () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <StepContainer>
          <SelectProvider />
        </StepContainer>
      </Provider>
    );
  });

  it("Component SelectProvider renders correctly", () => {
    expect(screen.getByText("Let's get started")).toBeInTheDocument();
  });

  describe("Select Provider step workflow", () => {
    it("Next button is visible", () => {
      const nextButton = screen.getByText("Next");
      expect(nextButton).toBeInTheDocument();
    });

    it("Next button is disabled by default", () => {
      const nextButton = screen.getByText("Next");
      expect(nextButton).toBeDisabled();
    });

    it("Next button enables upon selecting cloud", () => {
      const nextButton = screen.getByText("Next");
      const cloudProviders = screen.getAllByTestId("select-cloud");
      const selectCloud = () => {
        for (let i = 0; i < cloudProviders.length; i++) {
          return cloudProviders[i];
        }
      };
      userEvent.click(selectCloud());
      waitFor(() => {
        expect(nextButton).not.toBeDisabled();
      });
    });
  });
});
