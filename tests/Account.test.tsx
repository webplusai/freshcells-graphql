import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { USER_QUERY } from "../src/graphql/queries";
import Account from "../src/pages/Account";
import { MemoryRouter } from "react-router-dom";

beforeEach(() => {
  localStorage.setItem("token", "mock-token");
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mocks = [
  {
    request: {
      query: USER_QUERY,
      variables: {},
    },
    result: {
      data: {
        user: {
          firstName: "John",
          lastName: "Doe",
        },
      },
    },
    delay: 0,
  },
];

describe("Account", () => {
    it("displays the user's first and last name when the query is successful", async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <MemoryRouter>
            <Account />
          </MemoryRouter>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/account.firstName:/)).toBeInTheDocument();
        expect(screen.getByText(/account.lastName:/)).toBeInTheDocument();
      });

      expect(screen.getByText(/account.firstName:/)).toHaveTextContent(
        "account.firstName:"
      );
      expect(screen.getByText(/account.lastName:/)).toHaveTextContent(
        "account.lastName:"
      );
    });

  it("logs the user out when the logout button is clicked", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Account />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("account.firstName:")).toBeInTheDocument();
      expect(screen.getByText("account.lastName:")).toBeInTheDocument();
    });

    const logoutButton = screen.getByRole("button", {
      name: "account.logoutButton",
    });
    
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBeNull();
    });
  });
});
