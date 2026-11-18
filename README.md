# Maarij’s portfolio

Personal portfolio for maarij.dev. The website source is in `dist/` and can be served directly.

## Local preview

```sh
python -m http.server 8765 --directory dist
```

## Cloudflare Pages

Connect this repository, select `main` as the production branch, and set the build output directory to `dist`. Use the None framework preset and leave the build command empty.

[Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
