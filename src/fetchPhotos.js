const BASE_URL = 'https://pixabay.com/api';
const KEY = 'key=27615297-cbddad2d0ddf2be561a52608f';

const fetchPhotos = async searchValue => {
  const response = await fetch(
    `${BASE_URL}/?${KEY}&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true`,
  );
  const photos = await response.json();
  console.log(photos);
  return photos;
};

export default { fetchPhotos };
