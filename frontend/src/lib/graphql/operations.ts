import { graphql } from "@/gql";

export const REGISTER = graphql(`
  mutation Register($data: RegisterInput!) {
    register(data: $data) {
      token
      user {
        id
        name
        email
      }
    }
  }
`);

export const LOGIN = graphql(`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      token
      user {
        id
        name
        email
      }
    }
  }
`);

export const ME = graphql(`
  query Me {
    me {
      id
      name
      email
    }
  }
`);

export const UPDATE_PROFILE = graphql(`
  mutation UpdateProfile($data: UpdateProfileInput!) {
    updateProfile(data: $data) {
      id
      name
      email
    }
  }
`);

export const CATEGORIES = graphql(`
  query Categories {
    categories {
      id
      name
      description
      color
      icon
      transactionCount
    }
  }
`);

export const CREATE_CATEGORY = graphql(`
  mutation CreateCategory($data: CategoryInput!) {
    createCategory(data: $data) {
      id
    }
  }
`);

export const UPDATE_CATEGORY = graphql(`
  mutation UpdateCategory($id: ID!, $data: CategoryInput!) {
    updateCategory(id: $id, data: $data) {
      id
    }
  }
`);

export const DELETE_CATEGORY = graphql(`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`);

export const TRANSACTIONS = graphql(`
  query Transactions {
    transactions {
      id
      description
      date
      amountInCents
      type
      categoryId
    }
  }
`);

export const CREATE_TRANSACTION = graphql(`
  mutation CreateTransaction($data: TransactionInput!) {
    createTransaction(data: $data) {
      id
    }
  }
`);

export const UPDATE_TRANSACTION = graphql(`
  mutation UpdateTransaction($id: ID!, $data: TransactionInput!) {
    updateTransaction(id: $id, data: $data) {
      id
    }
  }
`);

export const DELETE_TRANSACTION = graphql(`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`);
