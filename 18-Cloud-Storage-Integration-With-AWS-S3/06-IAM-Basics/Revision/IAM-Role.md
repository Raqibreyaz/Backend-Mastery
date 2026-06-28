# AWS IAM Roles: Practical Notes

IAM is AWS’s system for controlling **who can do what, on which resource**. A role is one of the main ways AWS grants **temporary permissions** to something that needs to act in AWS. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)

## Core terms

- **Principal**: the thing making the request, or the trusted entity named in a trust/resource policy. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html)
- **Action**: the AWS API operation, like `s3:GetObject` or `ec2:StartInstances`. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)
- **Resource**: the AWS object being accessed, usually an ARN. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_resource.html)
- **Policy**: the permission document that allows or denies actions. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)
- **Role**: an identity that can be assumed temporarily. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html)
- **Trust policy**: says **who can assume the role**. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)
- **Permissions policy**: says **what the role can do after it is assumed**. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)

## The simplest role idea

An IAM role is like a **temporary badge**. Something can wear it for a while, use its permissions, and then the badge expires. The role itself still exists, and the same principal can assume it again later if allowed. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_manage-assume.html)

## Temporary access

Temporary access means the **session credentials** created by assuming a role only work for a limited time, such as 1 hour or several hours. After that, the temporary credentials stop working, but the role does not disappear. The same user or service can usually assume the role again and receive a fresh session if still trusted. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html)

## Why roles exist

Roles are useful when you do not want to give permanent credentials directly to a user or service.

Common uses:
- Lambda accessing S3.
- EC2 writing logs to CloudWatch.
- A user temporarily getting admin or deploy access.
- Cross-account access.
- Federated login / SSO temporary access. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html)

## User, group, role

- **User** = a permanent IAM identity for a person or system.
- **Group** = a collection of users sharing permissions.
- **Role** = a reusable identity that can be assumed temporarily. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)

Groups are for **users only**, not services. Services use roles, not groups. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)

## Identity policy vs resource policy

### Identity-based policy
Attached to a user, group, or role. It usually does **not** contain `Principal`, because the identity the policy is attached to is already the actor being granted permissions. [stackoverflow](https://stackoverflow.com/questions/71245966/iam-role-as-a-principal/71246054)

Example:

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

This means: the attached identity may read objects from `my-bucket`. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_resource.html)

### Resource-based policy
Attached to the resource itself. It explicitly names the trusted principal. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html)

Example S3 bucket policy:

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

This means the bucket trusts that specific role. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html)

## What trust policy means

The trust policy is the “who may assume me?” side of a role. It is not about what the role can do; it is about who is allowed to **take on** the role. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)

A typical Lambda trust policy looks like this:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "sts:AssumeRole"
            ],
            "Principal": {
                "Service": [
                    "lambda.amazonaws.com"
                ]
            }
        }
    ]
}
```

In plain English: **“Allow Lambda to assume this role.”** [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)

## Why Lambda shows up in the wizard and the trust policy

When creating a role for Lambda, AWS first asks which service should be trusted. That is just a friendly setup step for creating the trust policy. The trust policy then stores that choice in JSON, which is why you see `lambda.amazonaws.com` again. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)

The array form under `Principal` does not mean AWS is forcing you to trust extra things. It only means the policy format supports one or more principals. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)

## Service roles

Lambda, EC2, ECS tasks, and other AWS services usually get permissions through roles. The service itself is not “attached to” the role like a user or group. Instead, the service **assumes** the role and receives temporary credentials. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_manage-assume.html)

Example:
- Lambda function starts.
- AWS checks the role trust policy.
- Trust policy says Lambda can assume it.
- Lambda gets temporary credentials.
- Lambda uses the permissions policy attached to the role. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)

## IAM users assuming roles

An IAM user can also assume a role, but it is not “assigned” in the same way as a group or policy. The role must trust the user or the user’s account, and the user must have permission to call `sts:AssumeRole`. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_permissions-to-switch.html)

Example trust policy for a specific user:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "sts:AssumeRole"
            ],
            "Principal": {
                "AWS": [
                    "arn:aws:iam::482707530865:user/Dev_Guy"
                ]
            }
        }
    ]
}
```

This means: **only `Dev_Guy` is trusted to assume the role**.

## Trusting a whole account

If the trust policy uses the account ID, it means the whole account is trusted as a principal source. That is broader than trusting one user. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)

Example:
- `"Principal": { "AWS": "482707530865" }`

This means principals from that account may be allowed to assume the role, depending on the rest of the setup. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)

If the account is your own account, it means you are trusting identities from your own account. That is common when users inside one account need to switch into a shared role.

## Example: Lambda reading from S3

### Trust policy
Trusted principal: Lambda service.

### Permissions policy
Allow `s3:GetObject` on `company-images/*`.

### Result
Lambda can read objects from that bucket, but only because:
- Lambda is trusted by the role,
- and the role has the right S3 permission. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)

## Example: IAM user switching into deploy role

### User
`alice`

### Role
`DeployRole`

### Trust policy
Allows `alice` or her account to assume the role.

### Permissions policy
Allows deployment-related actions.

### Result
Alice uses her normal low-privilege account most of the time, and assumes `DeployRole` only when she needs temporary deployment access. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_permissions-to-switch.html)

## Example: cross-account access

Account A has a role in Account B.

- The role in Account B trusts Account A or a specific role/user from Account A.
- A principal in Account A assumes the role.
- It gets temporary access to Account B’s resources. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html)

This is one of the most important real-world uses of roles.

## Example: EC2

For EC2, the trust policy usually names:

```json
"Principal": {
  "Service": "ec2.amazonaws.com"
}
```

This means EC2 may assume the role. Then the role’s permissions decide what the instance can do, such as writing logs or reading from DynamoDB. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)

## Clean memory summary

- **Policy** = rules.
- **Action** = API operation.
- **Resource** = target ARN.
- **Principal** = actor or trusted entity.
- **Trust policy** = who can assume the role.
- **Permissions policy** = what the role can do.
- **Role** = temporary permission identity.
- **User** = permanent human/system identity.
- **Group** = many users sharing permissions.
- **Services use roles, not groups**. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)

## The shortest useful definition

An IAM role is a **temporary, assumable identity** with permissions attached to it, and a trust policy that says who may assume it. [docs.aws.amazon](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html)
