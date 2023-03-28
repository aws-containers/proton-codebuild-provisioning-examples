locals {
  account_id     = data.aws_caller_identity.current.account_id
  name_truncated = substr(var.name, 0, 29)
  lb_port        = 80
  lb_protocol    = "HTTP"
}
