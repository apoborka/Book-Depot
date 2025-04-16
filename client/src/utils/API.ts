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
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    return response.json();
  };

  export const loginUser = async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Failed to log in user');
    }
    return response.json();
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
  const response = await fetch(`${API_BASE_URL}/users/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  });
  if (!response.ok) {
    throw new Error('Failed to save book');
  }
  return response.json();
};

// Function to delete a book
export const deleteBook = async (bookId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/users/books/${bookId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete book');
  }
  return response.json();
};