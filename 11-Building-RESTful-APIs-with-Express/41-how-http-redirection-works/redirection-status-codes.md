| **Code** | **Redirect Type**      | **Method Behavior**                | **Caching** | **Use Case**                        |
|----------|-------------------------|-------------------------------------|-------------|--------------------------------------|
| **300**  | Multiple choices        | Client decides                     | No          | Listing multiple resource options   |
| **301**  | Permanent               | Method may change (`POST` → `GET`) | Yes         | URL restructuring, SEO redirects    |
| **302**  | Temporary               | Method may change (`POST` → `GET`) | No          | Temporary maintenance               |
| **303**  | Temporary (`GET` only)  | Always changes to `GET`            | No          | Form submissions, A/B testing       |
| **304**  | Not Modified            | No redirection; uses cache         | Yes         | Cache validation                    |
| **307**  | Temporary (Preserves)   | Method stays the same              | No          | Temporary redirects with data       |
| **308**  | Permanent (Preserves)   | Method stays the same              | Yes         | Permanent API migration             |
