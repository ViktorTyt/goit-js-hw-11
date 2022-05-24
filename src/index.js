import API from './fetchPhotos';
import Notiflix from 'notiflix';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

console.log(refs.form);

const render = photos => {
  console.log(photos.hits[0].webformatURL);
  const photosArr = photos.hits;
  const gallery = photosArr.map(
    photo => `<div class="photo-card">
    <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes ${photo.likes}</b>
      </p>
      <p class="info-item">
        <b>Views ${photo.views}</b>
      </p>
      <p class="info-item">
        <b>Comments ${photo.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads ${photo.downloads}</b>
      </p>
    </div>
  </div>`,
  );

  refs.gallery.insertAdjacentHTML('beforeend', gallery);
  //   console.log(gallery);
};

const onSubmit = async event => {
  event.preventDefault();
  const value = event.currentTarget.searchQuery.value;

  try {
    const getPhotos = await API.fetchPhotos(value);

    if (!getPhotos.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    }
    refs.gallery.innerHTML = '';
    render(getPhotos);
  } catch (error) {
    console.log(error);
  }
};

refs.form.addEventListener('submit', onSubmit);
