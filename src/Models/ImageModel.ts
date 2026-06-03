export default class ImageModel {
  id: number;
  name: string;
  isAvatar: boolean;
  linkToImage: string;
  dataImage: string;

  constructor(
    id: number,
    name: string,
    isAvatar: boolean,
    linkToImage: string,
    dataImage: string,
  ) {
    this.id = id;
    this.name = name;
    this.isAvatar = isAvatar;
    this.linkToImage = linkToImage;
    this.dataImage = dataImage;
  }
}
