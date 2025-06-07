| Feature          | Endpoint                           | Method | Auth             | Payload / Query Params                     |
| ---------------- | ---------------------------------- | ------ | ---------------- | ------------------------------------------ |
| Register         | `/api/users/register/register/`    | POST   | No               | `{ username, email, password, password2 }` |
| Login            | `/api/token/`                      | POST   | No               | `{ username, password }`                   |
| Current User     | `/api/user/`                       | GET    | Bearer `<token>` | —                                          |
| Update User      | `/api/user/`                       | PUT    | Bearer `<token>` | Partial user fields                        |
| List Posts       | `/api/posts/`                      | GET    | Optional         | `?limit=&offset=&tag=&author=&favorited=`  |
| Create Post      | `/api/posts/`                      | POST   | Bearer `<token>` | `{ title, body, tags: [] }`                |
| Retrieve Post    | `/api/posts/<slug>/`               | GET    | Optional         | —                                          |
| Update Post      | `/api/posts/<slug>/`               | PUT    | Bearer `<token>` | Partial post fields                        |
| Delete Post      | `/api/posts/<slug>/`               | DELETE | Bearer `<token>` | —                                          |
| Favorite Post    | `/api/posts/<slug>/favorite/`      | POST   | Bearer `<token>` | —                                          |
| Unfavorite Post  | `/api/posts/<slug>/favorite/`      | DELETE | Bearer `<token>` | —                                          |
| Personal Feed    | `/api/posts/feed/`                 | GET    | Bearer `<token>` | `?limit=&offset=`                          |
| List Comments    | `/api/posts/<slug>/comments/`      | GET    | Optional         | —                                          |
| Create Comment   | `/api/posts/<slug>/comments/`      | POST   | Bearer `<token>` | `{ body, parent (optional) }`              |
| Delete Comment   | `/api/posts/<slug>/comments/<id>/` | DELETE | Bearer `<token>` | —                                          |
| List Tags        | `/api/tags/`                       | GET    | Optional         | —                                          |
| Get Profile      | `/api/profiles/<username>/`        | GET    | Optional         | —                                          |
| Follow Profile   | `/api/profiles/<username>/follow/` | POST   | Bearer `<token>` | —                                          |
| Unfollow Profile | `/api/profiles/<username>/follow/` | DELETE | Bearer `<token>` | —                                          |
