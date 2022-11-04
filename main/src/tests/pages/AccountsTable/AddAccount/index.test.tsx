import { fireEvent, render, screen, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import AddAccount from "pages/AccountsTable/AddAccount";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { store } from "store/store";

const reRenderAfterPopup = jest.fn();

const setupFetchStub = (data: any) => {
  return () => {
    return Promise.resolve({
      json: () => data,
      status: 200,
    });
  };
};

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

  const getNextButton = () => screen.getByRole("button", { name: /Next/i });
  const getConnectButton = () =>
    screen.getByRole("button", { name: /Connect Account/i });

  it("Add Account initial state", async () => {
    expect(screen.getByText("Let's get started")).toBeInTheDocument();
    expect(getNextButton()).toBeDisabled();
  });

  describe("Add AWS Account", () => {
    it("with access keys", async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId("select-cloud-aws"));
      });

      expect(getNextButton()).not.toBeDisabled();

      await act(() => {
        fireEvent.submit(getNextButton());
      });

      await waitFor(() =>
        expect(screen.queryAllByText("Let's get started").length).toBe(0)
      );

      await waitFor(() => expect(getConnectButton()).toBeDisabled());

      fireEvent.click(screen.getAllByRole("radio")[0]);

      await act(() => {
        fireEvent.change(screen.getByRole("textbox", { name: /Account ID/i }), {
          target: { value: "AWSAC01" },
        });
        fireEvent.change(
          screen.getByRole("textbox", { name: /Access Key ID/i }),
          {
            target: { value: "accesskey" },
          }
        );
        fireEvent.change(
          screen.getByRole("textbox", { name: /Secret Access Key/i }),
          {
            target: { value: "accesskeysec" },
          }
        );
      });

      global.fetch = jest
        .fn()
        .mockImplementation(
          setupFetchStub({ spec: { accountId: "dolore deserunt commodo eu" } })
        );

      expect(getConnectButton()).not.toBeDisabled();

      await act(() => {
        fireEvent.submit(getConnectButton());
      });

      expect(screen.getByText("Account connection is complete!"));
    });

    it("with cloudFabric", async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId("select-cloud-aws"));
      });

      expect(getNextButton()).not.toBeDisabled();
      fireEvent.submit(getNextButton());

      await waitFor(() =>
        expect(screen.queryAllByText("Let's get started").length).toBe(0)
      );

      await waitFor(() => expect(getConnectButton()).toBeDisabled());

      await act(() => {
        fireEvent.click(screen.getAllByRole("radio")[1]);
      });

      global.fetch = jest
        .fn()
        .mockImplementation(
          setupFetchStub({ status: { createStackURL: "a" } })
        );

      expect(getConnectButton()).not.toBeDisabled();

      await act(() => {
        fireEvent.submit(getConnectButton());
      });

      await waitFor(() =>
        expect(screen.queryAllByText("Checking Credentials").length).toBe(0)
      );

      const submitBtn = screen.getByRole("button", { name: "Submit" });
      expect(submitBtn).toBeDisabled();

      await act(() => {
        fireEvent.change(screen.getByRole("textbox", { name: /Account ID/i }), {
          target: { value: "AWSCFT01" },
        });
        fireEvent.change(screen.getByRole("textbox", { name: /Role ARN/i }), {
          target: { value: "admin01" },
        });
      });

      expect(submitBtn).not.toBeDisabled();
      await act(() => {
        fireEvent.submit(submitBtn);
      });

      expect(screen.getByText(/successfully connected/i)).toBeInTheDocument();
    });
  });

  describe("Add Azure Account", () => {
    it("with access keys", async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId("select-cloud-azure"));
      });

      expect(getNextButton()).not.toBeDisabled();
      fireEvent.submit(getNextButton());

      await waitFor(() => expect(getConnectButton()).toBeDisabled());

      global.fetch = jest
        .fn()
        .mockImplementation(setupFetchStub({ spec: { name: "en" } }));

      await act(() => {
        fireEvent.change(screen.getByRole("textbox", { name: /Account ID/i }), {
          target: { value: "acc01azure" },
        });
        fireEvent.change(
          screen.getByRole("textbox", { name: /Access Key ID/i }),
          { target: { value: "az1212" } }
        );
        fireEvent.change(
          screen.getByRole("textbox", { name: /Secret Access Key/i }),
          { target: { value: "azaccess" } }
        );
        fireEvent.change(
          screen.getByRole("textbox", { name: /Directory ID/i }),
          { target: { value: "azdir" } }
        );
      });

      expect(getConnectButton()).not.toBeDisabled();

      await act(() => {
        fireEvent.submit(getConnectButton());
      });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Account connection is complete!"));
    });
  });

  describe("Add GCP Account", () => {
    it("with access keys & json file", async () => {
      const jsonFile = new File(["credentials"], "credentials.json", {
        type: "application/json",
      });

      await act(() => {
        fireEvent.click(screen.getByTestId("select-cloud-gcp"));
      });

      expect(getNextButton()).not.toBeDisabled();

      await act(() => {
        fireEvent.submit(getNextButton());
      });

      await waitFor(() =>
        expect(screen.getByText("Provide GCP Access Keys")).toBeInTheDocument()
      );

      const fileInput = screen.getByTestId("upload-json") as HTMLInputElement;

      global.fetch = jest
        .fn()
        .mockImplementation(
          setupFetchStub({ status: { accountId: "veniam commodo" } })
        );

      await act(() => {
        fireEvent.change(screen.getByRole("textbox", { name: /Account ID/i }), {
          target: { value: "gcpid01" },
        });
        fireEvent.change(fileInput, { target: { files: [jsonFile] } });
        // userEvent.upload(fileInput,jsonFile)
      });

      expect(fileInput.files).toHaveLength(1);

      // expect(getConnectButton()).not.toBeDisabled()

      await act(() => {
        fireEvent.submit(getConnectButton());
      });

      waitFor(() => {
        expect(screen.getByText("successfully connected")).toBeInTheDocument();
      });
    });
  });
});
