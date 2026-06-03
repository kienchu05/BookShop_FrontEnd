import React, { useEffect, useState } from "react";
import BookModel from "../Models/BookModel";
import { getBooksForCarousel } from "../API/ApiCarousel";
import BookCarousel from "../BookCarousel/BookCarousel";

const BookCarouselUI: React.FC = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [uploading, setUploading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBooksForCarousel()
      .then((response) => {
        setBooks(response);
        setUploading(false);
      })
      .catch((error) => {
        setError(error.message);
        setUploading(false);
      });
  }, []);

  if (uploading) {
    return (
      <div className="d-flex">
        <h1>Uploading ...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Errors : {error}</h1>
      </div>
    );
  }
  return <BookCarousel books={books} />;
};

export default BookCarouselUI;
