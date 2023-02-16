## Technologies:

Backend:

- Node.js + Express;
- MongoDb\Mongoose;
- JWT;
- Nginx;
- pm2;
- Celebrate;
- Winston;
- Letsencrypt;
- Jest\*;

## Backend part:

IP prod 51.250.12.246  
Current prod: https://api.bofeof-movies.nomoredomains.work 
or
Local: http://localhost:3005

#### API

- Url: https://api.bofeof-movies.nomoredomains.work or http://localhost:3005
- headers: {  
   "Content-Type": "application/json",  
  }

  Auth is based on jwt-cookie

Available endpoints:
Method | Endpoint | Action | Auth required | Required body data |
|--------|------------------|-------------------------------|----------------------------------|----------------------------------------------------------------------------------------------------|
| POST | api/signin | Log in | | email, password |
| POST | api/signup | Create user | | name, email, password |
| Get | api/signout | Log out | Yes |  |
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
