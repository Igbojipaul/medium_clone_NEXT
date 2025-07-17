<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



Be reminded about meta data 
Can a .env var that has the server url be used as a sub for localhost;
=======
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
>>>>>>> origin/main
