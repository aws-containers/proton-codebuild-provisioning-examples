locals {
  github_org  = split("/", var.repository_id)[0]
  github_repo = split("/", var.repository_id)[1]
}
