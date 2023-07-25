import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import Notiflix from 'notiflix';

const API_KEY = '36779044-50439618c93dcb9f395d82e01';

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSearch = newQuery => {
    setQuery(newQuery);
    setImages([]);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleItemClick = image => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const fetchImages = useCallback(async () => {
    if (!query) return;

    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://pixabay.com/api/?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
      );

      if (response.data.hits.length === 0 && page === 1) {
        Notiflix.Notify.warning('No images found for the searched query.');
      } else if (response.data.hits.length === 0 && page > 1) {
        Notiflix.Notify.info('No more images to load.');
      } else {
        setImages(prevImages => [...prevImages, ...response.data.hits]);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      setIsLoading(false);
    }
  }, [query, page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div className="app">
      <Searchbar onSubmit={handleSearch} />

      {isLoading && <Loader />}

      {images.length > 0 && (
        <ImageGallery images={images} onItemClick={handleItemClick} />
      )}

      {images.length > 0 && !isLoading && <Button onClick={handleLoadMore} />}

      {selectedImage && (
        <Modal image={selectedImage} onClose={handleCloseModal} />
      )}

      {/* Render other components */}
    </div>
  );
};

export default App;
