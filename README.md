# Intro

This is a sandbox for exploring applying computational effects to
images, with a focus on glitch art.

It is based primarily on p5js, though may eventually branch out
into some other technologies like Python and its wide variety of
libraries for modifying images.

# Development

Since p5 only requires serving static javascript to a browser, it's
quite easy to get started -- you just need to serve the `p5js-experiment`
directory over HTTP, then go to `https://localhost:<port>/sandbox`.

If you want autoupdating when you save a file in your editor, you can
do this with `browser-sync`. First, install that npm package.

```sh
npm install -g browser-sync
```

Then serve the site.

```sh
cd p5js-experiment
browser-sync start --server --files "./sandbox/**/*"
```
