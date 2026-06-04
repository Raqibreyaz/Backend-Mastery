For a React SPA on S3 behind CloudFront, the standard production setup is: keep the S3 bucket private, let CloudFront read it through Origin Access Control, set the distribution’s default root object to `index.html`, and map 403 errors to `/index.html` so deep links work. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DefaultRootObject.html)

## S3 bucket

Create a new S3 bucket to store the frontend build output, such as the files from `dist/` or `build/`. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
Keep the bucket **private** and leave public access blocked, because CloudFront can read private S3 content when you configure an Origin Access Control (OAC). [oneuptime](https://oneuptime.com/blog/post/2026-02-12-cloudfront-origin-access-control-oac-s3/view)

Typical flow:
- Create bucket.
- Keep “Block all public access” enabled.
- Upload the frontend build files.
- Do not use the S3 website endpoint for this pattern; use the bucket as a private S3 origin behind CloudFront. [oneuptime](https://oneuptime.com/blog/post/2026-02-12-cloudfront-origin-access-control-oac-s3/view)

## CloudFront access

Create a CloudFront distribution with the S3 bucket as the origin, then attach an **Origin Access Control** so CloudFront can fetch private objects from the bucket using SigV4. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
You also need a bucket policy that allows the CloudFront service principal to read objects, usually scoped to your specific distribution ARN. [oneuptime](https://oneuptime.com/blog/post/2026-02-12-cloudfront-origin-access-control-oac-s3/view)

This is the modern replacement for older Origin Access Identity setups. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
The result is:
- direct S3 access stays blocked,
- CloudFront can still fetch `index.html`, JS, CSS, images, and other assets from the bucket. [oneuptime](https://oneuptime.com/blog/post/2026-02-12-cloudfront-origin-access-control-oac-s3/view)

## Root object

Set the CloudFront distribution’s **Default root object** to `index.html`, with **no leading slash**. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DefaultRootObject.html)
That makes requests to the distribution root, such as `https://d123.cloudfront.net`, return `index.html`. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DefaultRootObject.html)

Important nuance: CloudFront’s default root object behavior applies to the distribution root and is not the same as S3 website index document behavior for subdirectories. [aws.amazon](https://aws.amazon.com/blogs/compute/implementing-default-directory-indexes-in-amazon-s3-backed-amazon-cloudfront-origins-using-lambdaedge/)
So `index.html` fixes the root URL, but it does not by itself solve SPA deep-link routes like `/dashboard/settings`. [cambelo](https://cambelo.com/posts/solving-spa-routing-challenges-on-aws-with-cloudfront-functions/)

## SPA routing

In a React SPA, the real route handling happens inside the built JavaScript bundle after `index.html` loads. [dev](https://dev.to/sepiyush/how-to-resolve-403-access-issues-when-deploying-a-spa-on-aws-with-s3-and-cloudfront-525o)
So when a user directly opens a path like `/profile` or refreshes that page, CloudFront asks S3 for an object at that path; because no such object exists, S3 often returns **403 Access Denied** for the private origin case instead of 404. [cambelo](https://cambelo.com/posts/solving-spa-routing-challenges-on-aws-with-cloudfront-functions/)

That is why SPA deep links can fail even though the app works fine from `/`. [dev](https://dev.to/sepiyush/how-to-resolve-403-access-issues-when-deploying-a-spa-on-aws-with-s3-and-cloudfront-525o)
The fix is to configure a **custom error response** in CloudFront so that 403 errors serve `/index.html` instead. [awstip](https://awstip.com/how-to-preserve-spa-route-path-in-the-browser-using-aws-cloudfront-51983a5519ee?gi=547119824df1)

## Custom error response

Configure a custom error response in CloudFront like this:
- Error code: `403`
- Response page path: `/index.html`
- HTTP response code: `200` [awstip](https://awstip.com/how-to-preserve-spa-route-path-in-the-browser-using-aws-cloudfront-51983a5519ee?gi=547119824df1)

With that rule, if CloudFront requests `/settings` from S3 and S3 returns 403 because that object does not exist, CloudFront responds with `index.html` instead, and then the React router takes over in the browser. [cambelo](https://cambelo.com/posts/solving-spa-routing-challenges-on-aws-with-cloudfront-functions/)
This is the common SPA fallback pattern for private S3 + CloudFront deployments. [cambelo](https://cambelo.com/posts/solving-spa-routing-challenges-on-aws-with-cloudfront-functions/)

A practical note: some teams also map 404 to `/index.html`, depending on origin behavior, but for private S3 origins the common failure mode is 403. [dev](https://dev.to/sepiyush/how-to-resolve-403-access-issues-when-deploying-a-spa-on-aws-with-s3-and-cloudfront-525o)

## Deployment flow

A clean deployment sequence is:

1. Build the frontend locally, producing `dist/` or `build/`.  
2. Create a new private S3 bucket and upload the build files. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
3. Create a CloudFront distribution with that bucket as the origin. [oneuptime](https://oneuptime.com/blog/post/2026-02-12-cloudfront-origin-access-control-oac-s3/view)
4. Attach an Origin Access Control and update the bucket policy to allow CloudFront reads. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
5. Set the default root object to `index.html` without a leading slash. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DefaultRootObject.html)
6. Add a custom error response for `403 -> /index.html -> 200` so React deep links work. [awstip](https://awstip.com/how-to-preserve-spa-route-path-in-the-browser-using-aws-cloudfront-51983a5519ee?gi=547119824df1)

### Quick revision

- Store the frontend build files in a new S3 bucket. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
- Keep the bucket private and leave public access blocked. [oneuptime](https://oneuptime.com/blog/post/2026-02-12-cloudfront-origin-access-control-oac-s3/view)
- Use CloudFront in front of S3 instead of serving the bucket publicly. [oneuptime](https://oneuptime.com/blog/post/2026-02-12-cloudfront-origin-access-control-oac-s3/view)
- Give CloudFront access to the private bucket using Origin Access Control. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
- Set the CloudFront default root object to `index.html`, not `/index.html`. [docs.aws.amazon](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DefaultRootObject.html)
- In a React SPA, deep links are handled by client-side JS, not by separate files in S3. [dev](https://dev.to/sepiyush/how-to-resolve-403-access-issues-when-deploying-a-spa-on-aws-with-s3-and-cloudfront-525o)
- For private S3 origins, missing SPA routes commonly return 403 from S3 through CloudFront. [cambelo](https://cambelo.com/posts/solving-spa-routing-challenges-on-aws-with-cloudfront-functions/)
- Fix deep-link refreshes by configuring CloudFront custom error handling: `403 -> /index.html -> 200`. [awstip](https://awstip.com/how-to-preserve-spa-route-path-in-the-browser-using-aws-cloudfront-51983a5519ee?gi=547119824df1)
