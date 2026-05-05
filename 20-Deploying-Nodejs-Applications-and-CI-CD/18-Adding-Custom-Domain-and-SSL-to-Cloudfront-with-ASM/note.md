## Custom domain on CloudFront
To use your own domain like `www.example.com` with CloudFront, add it to the distribution as an **alternate domain name** and attach an SSL/TLS certificate that covers that domain. [nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
If CloudFront cannot find a matching ACM certificate for that domain in your account, you must request or import one first. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CreatingCNAME.html)

The certificate must cover every hostname you add to the distribution, either by exact name or an appropriate wildcard in the certificate’s SAN list. [nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
So if you want both `example.com` and `www.example.com`, the certificate must include both, or use a wildcard that validly covers the subdomain name. [nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
## ACM certificate region
CloudFront is a global service, but for viewer HTTPS it only uses ACM certificates from **US East (N. Virginia), `us-east-1`**. [nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
That is why certificates created in other regions do not appear for CloudFront distribution selection. [oneuptime](https://oneuptime.com/blog/post/2026-02-12-acm-certificates-cloudfront-distributions/view)

So the rule is simple:
- Create or import the certificate in `us-east-1`.
- Then attach it to CloudFront. [nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)

If you are using an ACM-issued public certificate with AWS-integrated services like CloudFront, ACM manages renewal for you. [nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
You also generally do **not** need to export the certificate for CloudFront use. [aws.amazon](https://aws.amazon.com/certificate-manager/pricing/)
## Exportable certificate note
ACM public certificates used directly with integrated AWS services are the normal path. [nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
AWS charges apply to **exportable public certificates**, so if you do not need the private key outside AWS, skipping export is usually the right choice. [aws.amazon](https://aws.amazon.com/certificate-manager/pricing/)

In short:
- For CloudFront, use a normal ACM certificate in `us-east-1`.
- Do not choose export unless you specifically need the certificate outside ACM-managed AWS integrations. [aws.amazon](https://aws.amazon.com/certificate-manager/pricing/)
## DNS validation
ACM commonly verifies domain ownership using **DNS validation**, which gives you DNS records to add at your registrar or DNS provider such as GoDaddy. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CreatingCNAME.html)
After you add those validation records, ACM can prove that you control the domain and then issue the certificate. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CreatingCNAME.html)

These validation records are usually CNAME records. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CreatingCNAME.html)
Use the exact name and value ACM provides; many DNS panels auto-append the base domain, so in some providers you enter only the left-hand label portion of the record name rather than repeating the full domain twice. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CreatingCNAME.html)

The safe rule is:
- copy the value exactly,
- enter the record name in the format your DNS provider expects,
- then wait for ACM validation. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CreatingCNAME.html)
## Point domain to CloudFront
After the certificate is valid and the domain is attached to the distribution, point your domain to the CloudFront distribution domain such as `d123example.cloudfront.net`. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html)
For subdomains like `www.example.com`, a standard DNS **CNAME** record pointing to the CloudFront domain is the usual approach. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html)

Example:
- `www.example.com` → CNAME → `d123example.cloudfront.net` [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html)

That is why requests for your custom hostname ultimately reach CloudFront. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html)
A CNAME record points to a **domain name**, not to an IP address. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html)
## Apex domain
Your note about root domains needs one correction: standard DNS does not allow a CNAME at the zone apex like `example.com`, but that does **not** mean the apex can never point to CloudFront. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html)
It means you need a DNS provider feature such as an **alias/ANAME/flattening** record, or you use AWS Route 53 alias records, which can point the root domain to a CloudFront distribution. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html)

So:
- `www.example.com` → usually CNAME to CloudFront. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html)
- `example.com` → cannot be a standard CNAME at apex, but can still point to CloudFront using an alias-style DNS record if your DNS provider supports it. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html)

If your provider does **not** support apex aliasing, then redirecting `example.com` to `www.example.com` is a workaround, but it is not the only option in general. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html)
## Why no single IP
CloudFront does not give you one fixed distribution IP because it is a global CDN, not a single machine in one location. [oneuptime](https://oneuptime.com/blog/post/2026-02-12-acm-certificates-cloudfront-distributions/view)
A DNS lookup can resolve the CloudFront hostname to different IPs depending on geography, routing, and edge location behavior. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html)

That is exactly why you point DNS to the CloudFront **domain name** instead of expecting one permanent IP. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html)
## Root-to-www redirects
If your DNS provider cannot alias the apex domain to CloudFront, a redirect from `example.com` to `www.example.com` is a fallback approach. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html)
But your concern is correct: a crude provider-level forward may not preserve deeper paths like `/login` unless the provider explicitly supports path-preserving forwarding. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html)

A better production pattern is usually one of these:
- Use a DNS provider that supports apex aliasing to CloudFront. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html)
- Or handle redirect logic in infrastructure that preserves the full path and query string. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html)

So `example.com/login` should ideally redirect to `www.example.com/login`, not just to the home page. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html)
## HTTPS and performance
After attaching the ACM certificate and setting viewer protocol policy appropriately, CloudFront can serve your site over HTTPS using edge locations around the world. [nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
This is efficient because the static frontend files are cached and delivered from geographically distributed edge servers rather than a single origin server. [oneuptime](https://oneuptime.com/blog/post/2026-02-12-acm-certificates-cloudfront-distributions/view)

CloudFront pricing depends on requests, data transfer, and related usage dimensions. [aws.amazon](https://aws.amazon.com/certificate-manager/pricing/)
Static frontend hosting is often cost-effective because many assets are relatively small and highly cacheable, though total cost still depends on traffic volume, cache hit ratio, and transferred bytes rather than a blanket “static is always cheap” rule. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html)
## CORS and undefined Origin
For browser requests, the `Origin` header is typically sent for cross-origin requests and many non-simple same-site fetch scenarios, but it is not guaranteed to be present on every same-origin request. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-procedures.html)
So if server code blindly checks an allowlist array against `undefined`, same-origin or non-CORS cases can fail unexpectedly unless you explicitly handle missing `Origin` values. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-procedures.html)

A safer pattern is:
- allow no-`Origin` requests when appropriate for same-origin or non-browser cases,
- validate explicit origins only when the header is present. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-procedures.html)
### Quick revision
- Add your custom hostname as an alternate domain name on the CloudFront distribution. 
- CloudFront uses ACM certificates for viewer HTTPS, and the certificate must cover the hostname you add. [nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- For CloudFront, ACM certificates must be created or imported in `us-east-1`. [nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- Normal ACM certificates for AWS-integrated services are the standard choice; exportable public certificates add cost and are usually unnecessary here. [aws.amazon](https://aws.amazon.com/certificate-manager/pricing/)
- ACM gives DNS validation records, commonly CNAMEs, to prove domain ownership. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CreatingCNAME.html)
- Subdomains like `www.example.com` usually point to CloudFront with a CNAME record. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html)
- Apex domains like `example.com` cannot use a standard CNAME, but they can still point to CloudFront using alias-style DNS if the provider supports it. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html)
- CloudFront uses a domain name instead of one fixed IP because it is a distributed CDN with multiple edge IPs. [oneuptime](https://oneuptime.com/blog/post/2026-02-12-acm-certificates-cloudfront-distributions/view)
