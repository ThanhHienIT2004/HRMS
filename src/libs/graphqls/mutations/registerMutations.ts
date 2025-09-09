import { gql } from '@apollo/client';

const REGISTER_MUTATION = gql`
  mutation Register($userData: RegisterDto!) {
    register(userData: $userData) {
      email
      phone
      role
      employee_id
    }
  }
`;

export default REGISTER_MUTATION;
