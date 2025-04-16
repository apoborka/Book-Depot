const API_BASE_URL = '/api'; // Base URL for backend API

// Function to get the current user's data
export const getMe = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }

  return response.json();
};

// Function to create a new user
export const createUser = async (userData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorData = await response.json(); // Parse error response from the server
      throw new Error(errorData.message || 'Failed to create user');
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error('Error in createUser:', error); // Log the error for debugging
    throw error; // Re-throw the error for the caller to handle
  }
};

  // Funtion to login a user  
  export const loginUser = async (userData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to log in user');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error in loginUser:', error);
      throw error;
    }
  };

// Function to search Google Books
export const searchGoogleBooks = async (query: string) => {
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
  if (!response.ok) {
    throw new Error('Failed to fetch books from Google Books API');
  }
  return response;
};

// Function to save a book
export const saveBook = async (bookData: any, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include the token for authentication
      },
      body: JSON.stringify(bookData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save book');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in saveBook:', error);
    throw error;
  }
};

// Function to delete a book
export const deleteBook = async (bookId: string, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/books/${bookId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete book');
    }

    return await response.json(); // Return the updated user data
  } catch (error) {
    console.error('Error in deleteBook:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
