# Gulp Assemble Generator

> Yeoman generator using Gulp and Assemble — lets you quickly set up a static website.

**Warning:** This generator is used internally by our company and is therefore highly opinionated. If you don't agree with some of the techniques used in here that's fine — there are a lot of other static site generator out there.

## Usage
To be able to use this generator you need to have a couple of things installed, besides `node` and therefore `npm`:

```
npm install -g bower yo generator-gulp-assemble
```

When that's done, create a new directory and `cd` into it:

```
mkdir awesome-website && cd $_
```

Run `yo gulp-assemble` to create the project structure:

```
yo gulp-assemble [site-name]
```

After that, run `gulp` for preview and `gulp build` for building.


## What's included?

We're using [Gulp](http://gulpjs.com) as the glue that holds everything together.

### Assemble
Assemble is the static site generator. For further information on how to use this please refer to the [official readme](https://github.com/assemble/assemble).

### Sass
We're using SCSS in all our projects.
