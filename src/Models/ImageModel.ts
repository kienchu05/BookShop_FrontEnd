export default class ImageModel {
  id: number;
  name: string;
  isAvatar: boolean;
  linkToImage: string;

  constructor(
    id: number,
    name: string,
    isAvatar: boolean,
    linkToImage: string,
  ) {
    this.id = id;
    this.name = name;
    this.isAvatar = isAvatar;
    this.linkToImage = linkToImage;
  }
}
