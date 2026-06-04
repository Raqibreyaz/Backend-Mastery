# Limitations of Auth in Our StorageApp

1. Users can indefinitely extend the cookie expiry date on their own from dev-tools.
2. Any user can change the value of `uid` to another user's ID and gain access to their account.
3. We cannot logout a user manually without either deleting the user.
4. We cannot limit the number of devices a user can be logged into simultaneously.
5. If the database is leaked, an attacker can access any user's account without needing their password.
