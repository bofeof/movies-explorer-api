const anotherMovieId = '63e4ddce608ca9d44f8d9b72';

const invalidMovieId = '12345'

const newMovie = {
  country: 'Val Verde',
  director: 'John Doe',
  duration: 160,
  year: '1990',
  description: 'The most underrated movie of all the time',
  image:
    'https://todaysparent.mblycdn.com/tp/resized/2017/06/1600x900/when-your-kid-becomes-a-meme.jpg',
  trailerLink: 'https://youtu.be/bHXejJq5vr0',
  nameRU: 'Неизвестно',
  nameEN: 'Unknown',
  movieId: '123456789',
};

// invalid country and trailer link
const newMovieInvalidExample = {
  country: '',
  director: 'John Doe',
  duration: 160,
  year: '1990',
  description: 'The most underrated movie of all the time',
  image:
    'https://todaysparent.mblycdn.com/tp/resized/2017/06/1600x900/when-your-kid-becomes-a-meme.jpg',
  trailerLink: 'hyoutu.be/bHXejJq5vr0',
  nameRU: 'Неизвестно',
  nameEN: 'Unknown',
  movieId: '123456789',
};

module.exports = { anotherMovieId, invalidMovieId, newMovie, newMovieInvalidExample };
