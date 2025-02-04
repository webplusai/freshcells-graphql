import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
import { describe, expect, it, vi } from "vitest";
import { LOGIN_MUTATION } from "../src/graphql/mutations";
import Login from "../src/pages/Login";
import { MemoryRouter } from "react-router-dom";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mocks = [
  {
    request: {
      query: LOGIN_MUTATION,
      variables: {
        identifier: "test@example.com",
        password: "password123",
      },
    },
    result: {
      data: {
        login: {
          jwt: "mock-token",
        },
      },
    },
  },
];

describe("Login", () => {
  it("renders heading 1", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </MockedProvider>
    );

    const headingElement = screen.getByRole("heading", { level: 1 });
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent("login.title");
  });

  it("displays error when email is invalid", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </MockedProvider>
    );

    const emailInput = screen.getByPlaceholderText("login.emailPlaceholder");
    const passwordInput = screen.getByPlaceholderText(
      "login.passwordPlaceholder"
    );
    const submitButton = screen.getByRole("button", {
      name: "login.submitButton",
    });

    fireEvent.change(emailInput, { target: { value: "invalid@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("login.error")).toBeInTheDocument();
    });
  });

  it("displays success message on successful login", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </MockedProvider>
    );

    const emailInput = screen.getByPlaceholderText("login.emailPlaceholder");
    const passwordInput = screen.getByPlaceholderText(
      "login.passwordPlaceholder"
    );
    const submitButton = screen.getByRole("button", {
      name: "login.submitButton",
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("login.successMessage")).toBeInTheDocument();
    });
  });
});
