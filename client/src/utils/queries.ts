// filepath: c:\Users\alexp\Bootcamp\Non EdX Challenges\Challenge 18 - Book Search Engine\client\src\utils\queries.ts
import { gql } from '@apollo/client';

export const GET_ME = gql`
  query getMe {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        title
        description
        image
        link
      }
    }
  }
`;