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
Current prod: ... 
or
Local: http://localhost:3000

#### API

- Url: ... or http://localhost:3000
- headers: {  
   authorization: "Bearer " + your token,  
   "Content-Type": "application/json",  
  }

Available endpoints:
Method | Endpoint | Action | Token required ('Bearer ' + jwt) | Required body data |
|--------|------------------|-------------------------------|----------------------------------|----------------------------------------------------------------------------------------------------|
| POST | api/signin | Log in | | email, password |
| POST | api/signup | Create user | | name, email, password |
| GET | api/users/me | Get info about current user | Yes | |
| PATCH | api/users/me | Update user name and/or email | Yes | name, email |
| POST | api/movies | Create movie | Yes | country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId |
| DELETE | api/movies/:movieId | Remove movie | Yes | movie id |
| GET | api/movies | Get user library of movies | Yes | |


### Settings for backend. All comands are located in package.json:

- `npm install` Install all dependencies before start.
- `npm run start` Run Movies-explorer server. http://localhost:3000
- `npm run dev` Run server with hot-reload (for dev purposes)
- `npm run test` Jest request-tests for user and movies actions (for dev purposes)
