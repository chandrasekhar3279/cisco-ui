import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "store/store";
import { StepContainer } from "components/Steps";
import Access from "pages/AccountsTable/AddAccount/Access";
import { act } from "react-dom/test-utils";

describe("Step 2: Access", () => {
  beforeEach(async () => {
    await act(() => {
      render(
        <Provider store={store}>
          <StepContainer>
            <Access />
          </StepContainer>
        </Provider>
      );
    });
  });

  it("Access component renders properly", () => {
    expect(
      screen.getByText("Now lets setup access to your account")
    ).toBeInTheDocument();
  });

  describe("Cloud Formation Template (CFT) workflow", () => {
    it("Connect Account Button is visible", () => {
      const footerButtons: HTMLElement[] = screen.getAllByRole("button");
      const connectButton = footerButtons[1];
      expect(connectButton).toBeInTheDocument();
    });

    it("Connect to CloudFabric", () => {
      const footerButtons: HTMLElement[] = screen.getAllByRole("button");
      const connectButton = footerButtons[1];
      const cloudFabric = screen.getByTestId("connect-name");
      userEvent.click(cloudFabric);
      waitFor(() => {
        expect(connectButton).not.toBeDisabled();
      });
    });
  });
});
