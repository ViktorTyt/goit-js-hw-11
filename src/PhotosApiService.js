const BASE_URL = 'https://pixabay.com/api';
const KEY = 'key=27615297-cbddad2d0ddf2be561a52608f';

export default class PhotosApiService {
  constructor() {
    this.searchValue = '';
    this.page = 1;
    this.perPage = 20;
  }

  async fetchPhotos() {
    if (this.searchValue !== '') {
      const response = await fetch(
        `${BASE_URL}/?${KEY}&q=${this.searchValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`,
      );
      this.incrementPage();
      const photos = await response.json();
      console.log(photos);
      return photos;
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get _value() {
    return this.searchValue;
  }

  set _value(newValue) {
    this.searchValue = newValue;
  }
}
