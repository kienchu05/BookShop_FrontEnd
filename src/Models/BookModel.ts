class BookModel {
  id: number;
  name?: string;
  priceInit?: number;
  priceFinal?: number;
  description?: string;
  quantity?: number;
  author?: string;
  avgRating?: number;
  categories?: string;

  constructor(
    id: number,
    name?: string,
    priceInit?: number,
    priceFinal?: number,
    description?: string,
    quantity?: number,
    author?: string,
    avgRating?: number,
    categories?: string,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.priceInit = priceInit;
    this.priceFinal = priceFinal;
    this.quantity = quantity;
    this.author = author;
    this.avgRating = avgRating;
    this.categories = categories;
  }
}

export default BookModel;
