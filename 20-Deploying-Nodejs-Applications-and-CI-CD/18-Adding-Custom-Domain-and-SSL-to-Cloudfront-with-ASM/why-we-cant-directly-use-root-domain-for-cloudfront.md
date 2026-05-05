Yes — you **can** add the root domain like `storra.com` to CloudFront as an alternate domain name, and doing that is exactly how you avoid the redirect-only workaround at the CloudFront level. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/alternate-domain-names-move-options.html)
The real limitation is usually not CloudFront itself; the limitation is **DNS at the apex/root domain**, because standard DNS does not allow a normal CNAME record at `storra.com`. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CNAMEs.html)

## CloudFront side

CloudFront can serve both:
- `storra.com`
- `www.storra.com` [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/alternate-domain-names-move-options.html)

So in the distribution, you can add both hostnames as alternate domain names, as long as your ACM certificate covers both names. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-procedures.html)
From CloudFront’s perspective, using the root domain is valid. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CNAMEs.html)

## DNS side

The issue appears when you try to point `storra.com` to `xxxx.cloudfront.net` using DNS. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html)
For `www.storra.com`, a CNAME works fine; for `storra.com`, a standard CNAME is not allowed at the zone apex in normal DNS. [godaddy](https://www.godaddy.com/en-in/help/add-a-cname-record-19236)

That is why earlier discussion focused on `www.storra.com`: it is the easy DNS case. [godaddy](https://www.godaddy.com/en-in/help/add-a-cname-record-19236)

## When root domain works

If your DNS provider supports an apex-targeting feature such as:
- Route 53 **Alias**
- Cloudflare **CNAME flattening**
- ANAME / ALIAS records from other DNS providers [getintokube](https://getintokube.com/how-to-point-godaddy-apex-domain-to-cloudfront)

then you **can** point `storra.com` directly to CloudFront. [getintokube](https://getintokube.com/how-to-point-godaddy-apex-domain-to-cloudfront)
In that setup, add both `storra.com` and `www.storra.com` to CloudFront, and point both through DNS appropriately. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html)

This is the cleanest setup because:
- root domain works,
- `www` works,
- no registrar-only homepage redirect hack is needed. [getintokube](https://getintokube.com/how-to-point-godaddy-apex-domain-to-cloudfront)

## Why only `www` was discussed before

`www.storra.com` was discussed first because it avoids the apex DNS limitation and works with an ordinary CNAME at almost every provider. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CNAMEs.html)
If your DNS provider is something like GoDaddy without apex alias-style support, then `www` is often the only hostname you can directly point to CloudFront using standard DNS records. [reddit](https://www.reddit.com/r/aws/comments/q7jaim/route53_domain_aliasing_cloudfront_distribution/)

So the short answer is:
- We did not avoid `storra.com` because CloudFront rejects it.
- We avoided it because many DNS providers make the root-domain mapping harder than subdomain mapping. [reddit](https://www.reddit.com/r/aws/comments/q7jaim/route53_domain_aliasing_cloudfront_distribution/)

## Best practice

The best production setup is usually:
- Add both `storra.com` and `www.storra.com` to CloudFront. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html)
- Use a certificate covering both names. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html)
- Point `www` with a CNAME. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html)
- Point the apex/root with an alias-style DNS record if your provider supports it. [getintokube](https://getintokube.com/how-to-point-godaddy-apex-domain-to-cloudfront)

If your provider does not support that for the apex, then you either:
- move DNS to a provider that does, or
- keep `www` as canonical and redirect the apex elsewhere. [reddit](https://www.reddit.com/r/aws/comments/q7jaim/route53_domain_aliasing_cloudfront_distribution/)

## Direct answer

So yes, giving `storra.com` directly to CloudFront is actually a **better** end state, because it avoids the broken path-loss redirect pattern you mentioned earlier. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/alternate-domain-names-move-options.html)
But it only becomes fully usable when your DNS provider can map the apex/root domain to CloudFront using an alias-style feature rather than a standard CNAME. [docs.aws.amazon](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html)