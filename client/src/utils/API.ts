import { gql } from '@apollo/client';
import { client } from '../apolloClient';

const searchGoogleBooks = async (query: string) => {
  const SEARCH_BOOKS_QUERY = gql`
    query SearchBooks($query: String!) {
      searchBooks(query: $query) {
        bookId
        authors
        title
        description
        image
      }
    }
  `;

  const { data } = await client.query({
    query: SEARCH_BOOKS_QUERY,
    variables: { query },
  });

  if (!data || !data.searchBooks) {
    throw new Error('Failed to fetch books from GraphQL server');
  }

  return data.searchBooks;
};

export default searchGoogleBooks;