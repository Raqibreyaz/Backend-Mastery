in schema this doesn't adds a validation, instead it creates a unique index:

```js
mongoose.Schema({ email: { unique: true } });
```

mongoose may not create the index instantly, so give delay(there's a better way to do also):

```js
setTimeout(() => {
  mongoose.disconnect();
}, 100);
```

better way is to initialize the collection first before use:

```js
await User.init();
```

to create a normal index on a field:

```js
mongoose.Schema({ name: { index: true } });
```

to disable auto-index creation:
```js
mongoose.connect(DB_URI,{autoIndex:false})
```