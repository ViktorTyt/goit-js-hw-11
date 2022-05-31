import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api';
const KEY = 'key=27615297-cbddad2d0ddf2be561a52608f';

export default class PhotosApiService {
  constructor() {
    this.searchValue = '';
    this.page = 1;
    this.perPage = 40;
  }

  async fetchPhotos() {
    if (this.searchValue !== '') {
      const photos = await axios(
        `${BASE_URL}/?${KEY}&q=${this.searchValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`,
      );
      this.incrementPage();

      return photos.data;
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
