# Google Identity Services (GSI) vs Federated Credential Management (FedCM)

Google Identity Services (GSI) and Federated Credential Management (FedCM) are both used for implementing federated login experiences such as One Tap sign-in with Google.

* GSI renders the One Tap popup using an **iframe**.
* FedCM uses **native browser UI** to render the One Tap popup.
* GSI is being **deprecated** in favor of **FedCM**.
* Developers using the GSI client library do **not need to change their code** — it will **automatically migrate** to use FedCM behind the scenes.

FedCM is designed to improve privacy and security by reducing dependence on third-party cookies and giving more control to the browser rather than to websites or identity providers.

Stay updated with browser support and ensure your site meets FedCM requirements like COOP and COEP headers.
