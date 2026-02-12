Verifying Google ID Token

-> Google signs id_token using RS256 (RSA) algorithm.
-> Google provides public keys at:
    https://www.googleapis.com/oauth2/v3/certs (🔁 keys rotate periodically).
-> These keys are in JWK format — convert to PEM using jwk-to-pem since jsonwebtoken needs PEM.

Token Verification Steps:
    -> Fetch keys from v3/certs.
    -> Extract kid from token header.
    -> Find matching JWK.
    -> Convert JWK → PEM.
    -> Use jwt.verify(token, pem, { algorithms: ["RS256"] }).
    -> After verifying, check:
        aud === your client ID
        
-> Always verify both signature and audience to ensure the token is valid and intended for your app.