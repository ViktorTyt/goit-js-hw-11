import './css/styles.css';
import PhotosApiService from './PhotosApiService.js';
import Notiflix, { Loading } from 'notiflix';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

refs.loadMore.classList.add('is-hidden');

const photosApiService = new PhotosApiService();

const render = photos => {
  console.log(photos.hits[0].webformatURL);
  const photosArr = photos.hits;
  const gallery = photosArr
    .map(
      photo => `<div class="photo-card">
    <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</br> ${photo.likes}</b>
      </p>
      <p class="info-item">
        <b>Views</br> ${photo.views}</b>
      </p>
      <p class="info-item">
        <b>Comments</br> ${photo.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads</br> ${photo.downloads}</b>
      </p>
    </div>
  </div>`,
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', gallery);
  //   console.log(gallery);
};

const onSubmit = async event => {
  event.preventDefault();
  photosApiService._value = event.currentTarget.searchQuery.value.trim();
  photosApiService.resetPage();

  try {
    refs.loadMore.classList.add('is-hidden');
    const getPhotos = await photosApiService.fetchPhotos();

    if (!getPhotos.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    }
    refs.gallery.innerHTML = '';
    console.log(getPhotos);
    render(getPhotos);
    if (getPhotos.totalHits > photosApiService.perPage) {
      refs.loadMore.classList.remove('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
};

const OnLoadMore = async () => {
  const loadMore = await photosApiService.fetchPhotos();

  render(loadMore);
  console.log(loadMore.total);
  const loadedByPage = photosApiService.perPage * photosApiService.page - photosApiService.perPage;
  console.log(loadedByPage);

  if (loadMore.total < loadedByPage) {
    refs.loadMore.classList.add('is-hidden');
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
};

refs.form.addEventListener('submit', onSubmit);
refs.loadMore.addEventListener('click', OnLoadMore);
