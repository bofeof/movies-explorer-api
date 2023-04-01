## Technologies:

Backend:

- Node.js + Express;
- MongoDb\Mongoose;
- Cookie;
- Celebrate;
- Winston;
- Letsencrypt;
- Nginx;
- pm2;
- Jest (requests testing);

## Backend part:

IP prod 158.160.55.250
Current prod: https://api.bofeof-movies.nomoredomains.work/api
or
Local: http://localhost:3005(default)

#### API

- Url: https://api.bofeof-movies.nomoredomains.work/api or http://localhost:3005(default)
- headers: {  
   "Content-Type": "application/json",  
  }

  Auth is based on jwt-cookie

Available endpoints:
Method | Endpoint | Action | Auth required | Required body data |
|--------|------------------|-------------------------------|----------------------------------|----------------------------------------------------------------------------------------------------|
| POST | api/signin | Log in | | email, password |
| POST | api/signup | Create user | | name, email, password |
| GET | api/signout | Log out | Yes | |
| GET | api/users/me | Get info about current user | Yes | |
| PATCH | api/users/me | Update user name and/or email | Yes | name, email |
| POST | api/movies | Create movie | Yes | country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId |
| DELETE | api/movies/:movieId | Remove movie | Yes | movie id |
| GET | api/movies | Get user library of movies | Yes | |

### Settings for backend. All comands are located in package.json:

- `npm install` Install all dependencies before start.
- `npm run start` Run Movies-explorer server. http://localhost:3005
- `npm run dev` Run server with hot-reload (for dev purposes)
- `npm run test` Jest request-tests for user and movies actions (for dev purposes)
