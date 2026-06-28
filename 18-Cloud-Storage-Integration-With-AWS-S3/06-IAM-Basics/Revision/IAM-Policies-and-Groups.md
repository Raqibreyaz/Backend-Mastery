## AWS IAM: One Mental Model

IAM is AWS’s authorization system. It answers: **who** is trying to do **what**, on **which resource**, and whether that should be **allowed** or **denied**.

The key actors are:

- **Principal**: the thing making the request.
- **Action**: the API operation being attempted.
- **Resource**: the AWS object being acted on.
- **Policy**: the rule that allows or denies the action.

A simple mental formula is:

**Principal + Action + Resource + Policy decision = allow or deny**

## What a principal is

A principal is the identity AWS sees as the caller at the moment of authorization.

Examples of principals:
- An IAM user using the AWS Console.
- An IAM role assumed by a Lambda function.
- An EC2 instance role.
- A federated identity from an external login system.
- An AWS service acting on behalf of something else.

So when Lambda accesses S3, AWS does not think, “the Lambda code is the principal.” It thinks, “this call is made using the role Lambda assumed,” and that role is the principal for permission checking.

## Identity-based policy vs resource-based policy

This is the biggest source of confusion.

### Identity-based policy
This is the common IAM policy you attach to a **user, group, or role**.

It usually looks like this:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

Here:
- The **principal is implicit**.
- If this policy is attached to a role, then that role is the identity being granted permissions.
- You usually do **not** write `Principal` in this policy.

### Resource-based policy
This is attached to the **resource itself**, and it explicitly says which principals are trusted or allowed.

Example: an S3 bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:role/MyLambdaRole"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

Here:
- `Principal` is explicit.
- The bucket says, “this specific role may access me.”

## What `Effect`, `Action`, and `Resource` really mean

### Effect
`Effect` says whether the statement grants or blocks access.

- `Allow` means the action is permitted if other checks also pass.
- `Deny` means the action is explicitly blocked.

An explicit deny usually wins over allow.

### Action
An action is an AWS API operation, not just generic CRUD.

Examples:
- `s3:PutObject`
- `s3:GetObject`
- `ec2:StartInstances`
- `dynamodb:UpdateItem`

CRUD is only a rough analogy:
- Create ≈ `Put`, `Create`
- Read ≈ `Get`, `List`
- Update ≈ `Update`
- Delete ≈ `Delete`

But IAM actions are service-specific API names.

### Resource
The resource is the specific AWS object the action applies to.

Examples:
- `arn:aws:s3:::my-bucket`
- `arn:aws:s3:::my-bucket/*`
- `arn:aws:lambda:ap-south-1:123456789012:function:process-orders`

If a service supports resource-level permissions, you can scope the policy tightly to just one resource.

## Who gets the policy

An IAM policy by itself is just a document. It becomes meaningful only when attached or used in a trust/resource relationship.

Common attachment targets:
- **User**
- **Group**
- **Role**

So yes, your earlier understanding was right: the policy is reusable. You can attach the same managed policy to many users or roles.

## Groups are only for users

Groups are just a convenience to manage many users together.

Example:
- `Developers` group
- `Admins` group
- `ReadOnly` group

You attach policies to the group, and every user in that group inherits them.

Important:
- Groups are for **users only**
- Groups are **not** for services
- A Lambda function, EC2 instance, or ECS task does not join a group

## Services do not get policies directly

This is subtle but important.

A service usually gets permissions by **assuming a role**.

Example:
- You create a role named `LambdaS3ReadRole`
- Attach a policy to that role
- Configure Lambda to use that role
- Lambda then uses temporary credentials from that role to call S3

So the service itself is not the thing policies attach to. The service uses a **role**.

## Human vs long-lived identity

### Human
A human is a person using AWS through:
- IAM user
- IAM Identity Center
- Federation via SSO or external login

The human is the real-world person, but AWS authorizes the AWS identity or session representing them.

### Long-lived identity
This means an identity that exists beyond one temporary session.

Examples:
- IAM user
- IAM role as a reusable identity

But roles typically issue temporary credentials when assumed, so the session is temporary even though the role itself is a persistent IAM object.

A good way to think about it:
- **User**: a standing identity for a person or system
- **Role**: a standing identity that can be assumed temporarily
- **Session**: the temporary credentials currently active

## Detailed example 1: Lambda reading from S3

Suppose you have:
- Lambda function: `ProcessImages`
- S3 bucket: `company-images`

You want Lambda to read objects from the bucket.

### Role setup
Create a role:
- `ProcessImagesRole`

Attach this policy to the role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::company-images/*"
    }
  ]
}
```

### What happens
- Lambda assumes `ProcessImagesRole`
- The role becomes the effective principal
- Lambda calls `s3:GetObject`
- AWS checks whether that principal is allowed on that resource
- The request is allowed if everything matches

### Why this works
The policy does not say “Lambda” explicitly. It says what the role can do. Lambda gets those permissions through the role.

## Detailed example 2: User listing one bucket but not another

Suppose user `alice` has this policy attached:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::team-a-bucket"
    }
  ]
}
```

Now:
- `alice` can list `team-a-bucket`
- `alice` cannot list `team-b-bucket`
- `alice` cannot read objects unless another policy allows `s3:GetObject`

This shows the policy is scoped to one resource and one action.

## Detailed example 3: Resource-based access

Suppose you want a bucket to allow one role from another account.

Bucket policy on `logs-bucket`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::999999999999:role/AnalyticsRole"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::logs-bucket/*"
    }
  ]
}
```

Here the bucket itself is saying:
- only `AnalyticsRole` may read objects
- the principal is explicitly named
- this is different from an identity policy because the trust is on the resource side

## Clean rules to remember

- `Effect` = allow or deny.
- `Action` = specific AWS API operation.
- `Resource` = the exact AWS object.
- `Principal` = who is making the request, or who is trusted in a resource/trust policy.
- Identity policies usually do not contain `Principal`.
- Resource policies always care about `Principal`.
- Policies attach to users, groups, or roles.
- Groups are for users only.
- Services use roles, not groups.

## Best way to remember it

Think of IAM like a security system:

- **Principal** = the person/card that tries to enter.
- **Action** = the thing they want to do.
- **Resource** = the room or object they want to access.
- **Policy** = the rulebook.
- **Role** = a wearable badge the service can assume.
- **Group** = a team membership for people.

So if Lambda needs to access S3, you do not attach a policy “to Lambda” directly. You attach it to a role, and Lambda assumes that role.