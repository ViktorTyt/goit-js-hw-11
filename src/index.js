import './css/styles.css';
import PhotosApiService from './PhotosApiService.js';
import Notiflix, { Loading } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

refs.loadMore.classList.add('is-hidden');

const photosApiService = new PhotosApiService();

const render = photos => {
  const photosArr = photos.hits;

  const gallery = photosArr
    .map(
      photo => `<div class="photo-card">
      <a href="${photo.largeImageURL}">
    <img class="photo-card__image" src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b class="info-item__title">Likes</b>
        <b class="info-item__text">${photo.likes}</b>
      </p>
      <p class="info-item">
        <b class="info-item__title">Views</b>
        <b class="info-item__text">${photo.views}</b>
      </p>
      <p class="info-item">
        <b class="info-item__title">Comments</b>
        <b class="info-item__text">${photo.comments}</b>
      </p>
      <p class="info-item">
        <b class="info-item__title">Downloads</b>
        <b class="info-item__text">${photo.downloads}</b>
      </p>
    </div>
  </div>`,
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', gallery);

  const lightbox = new SimpleLightbox('.gallery a', {
    fadeSpeed: 250,
    overlayOpacity: 0.7,
    captionsData: 'alt',
  });

  lightbox.refresh();
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
    } else {
      Notiflix.Notify.success(`Hooray! We found ${getPhotos.totalHits} images.`);
    }

    refs.gallery.innerHTML = '';
    render(getPhotos);

    if (getPhotos.totalHits > photosApiService.perPage) {
      refs.loadMore.classList.remove('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }

  window.scroll({ top: 0 });
};

const OnLoadMore = async () => {
  const loadMore = await photosApiService.fetchPhotos();

  render(loadMore);

  const loadedByPage = photosApiService.perPage * photosApiService.page - photosApiService.perPage;

  if (loadMore.total < loadedByPage) {
    refs.loadMore.classList.add('is-hidden');
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
};

refs.form.addEventListener('submit', onSubmit);
refs.loadMore.addEventListener('click', OnLoadMore);
