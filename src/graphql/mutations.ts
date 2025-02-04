import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation login($identifier: String!, $password: String!) {
    login(input: { identifier: $identifier, password: $password }) {
      jwt
    }
  }
`;

export interface LoginData {
  login: {
    jwt: string;
  };
}

export interface LoginVars {
  identifier: string;
  password: string;
}
