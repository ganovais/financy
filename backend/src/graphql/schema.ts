export const typeDefs = /* GraphQL */ `
  enum TransactionType {
    income
    expense
  }

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Category {
    id: ID!
    name: String!
    description: String!
    color: String!
    icon: String!
    transactionCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Transaction {
    id: ID!
    description: String!
    date: String!
    amountInCents: Int!
    type: TransactionType!
    categoryId: ID!
    category: Category!
    createdAt: String!
    updatedAt: String!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    name: String!
  }

  input CategoryInput {
    name: String!
    description: String
    color: String!
    icon: String!
  }

  input TransactionInput {
    description: String!
    date: String!
    amountInCents: Int!
    type: TransactionType!
    categoryId: ID!
  }

  type Query {
    me: User!
    categories: [Category!]!
    transactions: [Transaction!]!
  }

  type Mutation {
    register(data: RegisterInput!): AuthPayload!
    login(data: LoginInput!): AuthPayload!
    updateProfile(data: UpdateProfileInput!): User!
    createCategory(data: CategoryInput!): Category!
    updateCategory(id: ID!, data: CategoryInput!): Category!
    deleteCategory(id: ID!): ID!
    createTransaction(data: TransactionInput!): Transaction!
    updateTransaction(id: ID!, data: TransactionInput!): Transaction!
    deleteTransaction(id: ID!): ID!
  }
`;
