## Purpose

Mongoose validation itself is middleware, and `save()` triggers validation first because Mongoose has a built-in `pre('save')` hook that calls `validate()`.  Because of that flow, `pre('validate')` runs before the rest of the save lifecycle and also runs when you explicitly call `doc.validate()`. [mongoosejs](https://mongoosejs.com/docs/validation.html)

## Best uses

Use `pre('validate')` for data cleanup such as trimming strings or lowercasing emails, because validators should usually run against normalized values rather than raw request input.  It is also a good place to generate derived fields such as a slug from a title when the derived field must exist before validation finishes.  It also works well for cross-field rules like “either password or googleId must be present,” where multiple fields must be checked together. [oneuptime](https://oneuptime.com/blog/post/2026-03-31-mongodb-mongoose-pre-post-middleware/view)

## Example note

```js
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: /\S+@\S+\.\S+/,
  },
  username: {
    type: String,
    required: true,
  },
  password: String,
  googleId: String,
  slug: {
    type: String,
    required: true,
  },
});

userSchema.pre('validate', function (next) {
  if (this.email) this.email = this.email.toLowerCase().trim();
  if (this.username) this.username = this.username.trim();

  if (this.username && !this.slug) {
    this.slug = this.username
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  if (!this.password && !this.googleId) {
    this.invalidate('password', 'Either password or googleId is required');
  }

  next();
});
```

This combines the three common patterns: normalization, derived-field generation, and cross-field validation before Mongoose runs normal validators. [stackoverflow](https://stackoverflow.com/questions/63098294/validation-in-mongoose-schema/63098763)

## Rules to remember

Use a regular `function` instead of an arrow function, because `this` needs to point to the current document inside middleware.  Prefer schema validators such as `required`, `enum`, `match`, `min`, and `max` for simple field-level rules, and use `pre('validate')` only when logic depends on preprocessing or multiple fields together.  For simple dependency-based rules, Mongoose also supports conditional `required` functions directly in the schema, which can be cleaner than a hook. [github](https://github.com/Automattic/mongoose/issues/6573)

## Limits

`pre('validate')` is document middleware, so it does not behave the same way for query-style updates such as `updateOne()` or `findOneAndUpdate()`, even when validators are enabled.  For those update operations, use query/update middleware or validate the data another way, because `pre('validate')` expects a document context.  A good practical split is: `pre('validate')` for cleanup and cross-field checks, schema validators for field rules, and `pre('save')` for persistence concerns like password hashing. [oneuptime](https://oneuptime.com/blog/post/2026-03-31-mongodb-mongoose-pre-post-middleware/view)

## Copyable note

`pre('validate')` in Mongoose runs before validation on a document. Use it to normalize fields, prepare derived values that validators depend on, and enforce cross-field conditions. Use regular functions so `this` refers to the document. Do not rely on it for query updates like `findOneAndUpdate()`. Prefer normal schema validators for simple field rules, and reserve `pre('save')` for save-time concerns such as hashing. [mongoosejs](https://mongoosejs.com/docs/middleware.html)