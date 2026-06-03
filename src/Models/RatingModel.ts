export default class RatingModel {
  id: number;
  comment: string;
  rate: number;
  book_id: number;
  user_id: number;

  constructor(
    id: number,
    comment: string,
    rate: number,
    book_id: number,
    user_id: number,
  ) {
    this.id = id;
    this.comment = comment;
    this.rate = rate;
    this.book_id = book_id;
    this.user_id = user_id;
  }
}
