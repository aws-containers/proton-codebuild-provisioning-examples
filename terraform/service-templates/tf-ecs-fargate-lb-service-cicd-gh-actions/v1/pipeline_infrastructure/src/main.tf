resource "aws_ecr_repository" "main" {
  name                 = "${var.proton_service}-${local.github_org}-${local.github_repo}"
  image_tag_mutability = "IMMUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_iam_role" "github_actions" {
  name               = "${var.proton_service}-github-action-${local.github_org}-${local.github_repo}"
  assume_role_policy = data.aws_iam_policy_document.github_actions_assume_role.json

  inline_policy {
    name = "github-actions"
    policy = jsonencode({
      Version : "2012-10-17",
      Statement = [
        {
          Effect = "Allow"
          Action = [
            "ecr:GetAuthorizationToken"
          ]
          Resource = "*"
        },
        {
          Effect = "Allow"
          Action = [
            "ecr:BatchCheckLayerAvailability",
            "ecr:BatchGetImage",
            "ecr:CompleteLayerUpload",
            "ecr:DeleteRepository",
            "ecr:GetRepositoryPolicy",
            "ecr:InitiateLayerUpload",
            "ecr:ListTagsForResource",
            "ecr:PutImage",
            "ecr:SetRepositoryPolicy",
            "ecr:UploadLayerPart"
          ]
          Resource = aws_ecr_repository.main.arn
        },
        {
          Effect = "Allow"
          Action = [
            "proton:GetService",
          ]
          Resource = "arn:aws:proton:us-east-1:${data.aws_caller_identity.current.account_id}:service/${var.proton_service}"
        },
        {
          Effect = "Allow"
          Action = [
            "proton:GetServiceInstance",
            "proton:UpdateServiceInstance",
          ]
          Resource = "arn:aws:proton:us-east-1:${data.aws_caller_identity.current.account_id}:service/${var.proton_service}/service-instance/*"
        },
      ]
    })
  }
}

data "aws_iam_policy_document" "github_actions_assume_role" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [data.aws_iam_openid_connect_provider.current.arn]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.repository_id}:*"]
    }
  }
}

# github actions workflow yaml file
resource "local_file" "workflow" {
  filename = "deploy.yml"
  content = templatefile("${path.module}/deploy-template.yml", {
    region                   = data.aws_region.current.name,
    role                     = aws_iam_role.github_actions.arn,
    ecr_repo                 = aws_ecr_repository.main.name,
    branch_name              = var.branch_name,
    proton_service           = var.proton_service,
    proton_service_instances = var.proton_service_instances,
    docker_path              = var.docker_path,
  })
}
