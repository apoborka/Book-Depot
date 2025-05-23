import { useQuery, useMutation } from '@apollo/client';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import type { Book } from '../models/Book';

const SavedBooks = () => {
  // Execute the GET_ME query to fetch user data
  const { loading, data, error } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  // Handle loading state
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // Handle errors
  if (error) {
    return <h2>Error loading saved books.</h2>;
  }

  // Extract user data from the query response
  const userData = data?.me || {};

  // Function to handle deleting a book
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
  
    if (!token) {
      return false;
    }
  
    try {
      // Call the REMOVE_BOOK mutation
      await removeBook({
        variables: { bookId },
        refetchQueries: [{ query: GET_ME }], // Re-fetch the GET_ME query
      });
  
      // Remove the book's ID from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error('Error in handleDeleteBook:', err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks?.map((book: Book) => (
            <Col md="4" key={book.bookId}>
              <Card border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;