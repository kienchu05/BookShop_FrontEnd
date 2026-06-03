class BookModel {
  id: number;
  name?: string;
  priceInit?: number;
  priceFinal?: number;
  description?: string;
  quantity?: number;
  author?: string;
  avgRating?: number;

  constructor(
    id: number,
    name?: string,
    priceInit?: number,
    priceFinal?: number,
    description?: string,
    quantity?: number,
    author?: string,
    avgRating?: number,
  ) {
    this.id = id;
    this.name = name;   
    this.description = description;
    this.priceInit = priceInit;
    this.priceFinal = priceFinal;
    this.quantity = quantity;
    this.author = author;
    this.avgRating = avgRating;
  }
}

export default BookModel;
