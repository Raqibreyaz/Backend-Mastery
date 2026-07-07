## Core auth concepts

- MongoDB auth = **authentication** (who are you) + **authorization** (what can you do).
- Users are defined with:
  - `user` (name)
  - `pwd`
  - `roles`: each role grants privileges on resources (DBs/collections).
- A user is logically identified as: **`<authDB>.<username>`** (auth DB = database where the user was created).

Example:

```js
use admin
db.createUser({
  user: "appUser",
  pwd: "secret",
  roles: [
    { role: "readWrite", db: "myapp" }
  ]
})
```

- This defines user `admin.appUser` who authenticates against `admin`, but has `readWrite` on `myapp`.

***

## Why we often create users in `admin`

- The database you `use` when calling `db.createUser()` becomes the user’s **authentication database**.
- Best practice: create most users in `admin` and then grant roles on other DBs.

Why this is nice:

- One consistent auth DB: every client uses `authSource=admin` (or equivalent) and you don’t have to remember per-user auth DBs.
- Built-in “global” roles (`readWriteAnyDatabase`, `dbAdminAnyDatabase`, `userAdminAnyDatabase`, etc.) are intended for users anchored in `admin`.
- Operationally simple: to see/manage all users, you look at `admin` users instead of hunting across DBs.

Curiosity hook:  
You *can* create two users with the same `user` name in different auth DBs (`admin.alice`, `myapp.alice`) and give them different passwords and roles. This can confuse clients if they accidentally authenticate against the wrong auth DB.

***

## Why users “belong” to a DB if roles can span DBs?

Think of user definition as two orthogonal axes:

1. **Auth anchor (auth DB)**  
   - Where credentials live and where the server looks when you say “authenticate this username/password.”
   - This does *not* inherently limit which DBs the user can touch.

2. **Authorization scope (roles)**  
   - What the user can do and on which DBs/collections.
   - Roles can:
     - Target a single DB (`readWrite` on `myapp`)
     - Target multiple DBs (multiple per-DB roles)
     - Be global (`readWriteAnyDatabase`)

So user in `admin` with roles spanning multiple DBs is normal:

```js
use admin
db.createUser({
  user: "reportUser",
  pwd: "pw",
  roles: [
    { role: "read", db: "app1" },
    { role: "read", db: "app2" }
  ]
})
```

- `reportUser` authenticates via `admin`, but can read from both `app1` and `app2`.

When might you put users in non-`admin` DBs?

- You want **strict conceptual binding**: “users of DB X are defined *in* DB X.”
- Very simple single-DB apps:

```js
use blog
db.createUser({
  user: "blogUser",
  pwd: "pw",
  roles: [ { role: "readWrite", db: "blog" } ]
})
```

- That’s not wrong; it’s just less flexible if you later need cross-DB access.

***

## Normal (standalone) auth vs replica set auth

### Standalone auth

- Single `mongod`.
- Steps:
  1. Start `mongod` without auth.
  2. Create admin user.
  3. Enable `authorization: enabled` in config; restart.
  4. Clients connect and authenticate (SCRAM, etc.) using username/password and auth DB.

Example URI:

```text
mongodb://appUser:secret@localhost:27017/myapp?authSource=admin
```

### Replica set auth – two layers

Replica set adds another dimension:

1. **Client → cluster auth**  
   - Same mechanisms: SCRAM, usernames, passwords, roles.
   - Clients use a replica-set-aware URI:

```text
mongodb://appUser:secret@host1,host2,host3/myapp?replicaSet=rs0&authSource=admin
```

   - Driver discovers primary and secondaries and handles failover.

2. **Node ↔ node internal auth**  
   - Member processes must authenticate *each other* to participate in the replica set.
   - Typically done via **keyfile** (shared secret across all members) or certificates.
   - Config snippet:

```yaml
replication:
  replSetName: rs0
security:
  authorization: enabled
  keyFile: /etc/mongo-keyfile
```

- Only `mongod`s with the correct keyfile can join and replicate.

Curiosity hook:  
You can create a replica set with auth off, then later turn on both access control and keyfile-based internal auth. Doing it in the wrong order can temporarily lock you out or leave windows where nodes accept unauthenticated replication.

***

## Practical flows with examples

### Flow: create a multi-DB app user in `admin`

Goal: user can read/write `app_db` but nothing else.

```js
use admin
db.createUser({
  user: "appUser",
  pwd: "strongpw",
  roles: [
    { role: "readWrite", db: "app_db" }
  ]
})
```

Client URI:

```text
mongodb://appUser:strongpw@cluster0.example.mongodb.net/app_db?authSource=admin
```

- Auth DB = `admin`, but app uses logical DB `app_db`.

### Flow: single-DB, “self-contained” user (non-admin auth DB)

Goal: keep everything scoped visually to a single DB.

```js
use billing
db.createUser({
  user: "billingApp",
  pwd: "pw",
  roles: [
    { role: "readWrite", db: "billing" }
  ]
})
```

- Now auth DB is `billing`; client must specify `authSource=billing` (or use `billing` as DB in some drivers).

### Flow: convert standalone → replica set with auth

High-level steps:

1. Standalone, no auth:
   - Start `mongod`.
   - Create admin user in `admin`.
2. Enable `authorization`.
3. Configure replica set (`replSetName`).
4. Create keyfile, copy to all members, configure `keyFile` on each.
5. Restart all members with `auth + replSetName + keyFile`.
6. Initiate replica set, add members.
7. Clients connect via replica set URI and authenticate as usual.

Curiosity question to test yourself:  
- If you add a new secondary node to the replica set, which auth-related steps do you need to repeat on that node? (Hint: replica set config + same keyfile + same users synchronized via replication.)

***

## Key takeaways

1. **Auth DB vs roles**:  
   - Auth DB (e.g. `admin`) is the *login anchor*.  
   - Roles decide **actual** DB access; they can span any number of DBs.

2. **Use `admin` by default**:  
   - Centralizes users.  
   - Works naturally with global roles.  
   - Simplifies client configuration (`authSource=admin` everywhere).

3. **Non-`admin` auth DB users are niche**:  
   - Mostly for single-DB or strongly isolated use cases.  
   - Increase cognitive load (per-user auth DB awareness).

4. **Replica set auth adds internal security**:  
   - Client auth stays the same as standalone.  
   - Extra requirement: member ↔ member authentication via keyfile/certs.

5. **From a client’s POV**, the main difference between standalone and replica set is the **connection URI** (multiple hosts + `replicaSet` param), not the user/role model.