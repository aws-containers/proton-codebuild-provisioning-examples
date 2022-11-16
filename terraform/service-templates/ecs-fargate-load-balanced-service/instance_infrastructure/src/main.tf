resource "aws_alb" "main" {
  name            = local.name_truncated
  subnets         = [var.public_subnet_one_id, var.public_subnet_two_id]
  security_groups = [aws_security_group.sg_lb.id]
}

resource "aws_alb_listener" "http" {
  load_balancer_arn = aws_alb.main.id
  port              = local.lb_port
  protocol          = local.lb_protocol

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main.id
  }
}

resource "aws_lb_target_group" "main" {
  name                 = local.name_truncated
  vpc_id               = var.vpc_id
  target_type          = "ip"
  port                 = var.container_port
  protocol             = local.lb_protocol
  deregistration_delay = 30

  health_check {
    path                = var.health_check_path
    interval            = 30
    timeout             = 10
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }
}

resource "aws_security_group" "sg_lb" {
  name        = "${var.name}-lb"
  description = "Allow connections from external resources while limiting connections from ${local.name_truncated}-lb to internal resources"
  vpc_id      = var.vpc_id
}

resource "aws_security_group" "sg_task" {
  name        = "${var.name}-task"
  description = "Limit connections from internal resources while allowing ${var.name}-task to connect to all external resources"
  vpc_id      = var.vpc_id
}

resource "aws_security_group_rule" "ingress_lb_http" {
  type              = "ingress"
  description       = local.lb_protocol
  from_port         = local.lb_port
  to_port           = local.lb_port
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.sg_lb.id
}

resource "aws_security_group_rule" "sg_lb_egress_rule" {
  description              = "Only allow SG ${var.name}-lb to connect to ${var.name}-task on port ${var.container_port}"
  type                     = "egress"
  from_port                = var.container_port
  to_port                  = var.container_port
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.sg_task.id
  security_group_id        = aws_security_group.sg_lb.id
}

resource "aws_security_group_rule" "sg_task_ingress_rule" {
  description              = "Only allow connections from SG ${var.name}-lb on port ${var.container_port}"
  type                     = "ingress"
  from_port                = var.container_port
  to_port                  = var.container_port
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.sg_lb.id
  security_group_id        = aws_security_group.sg_task.id
}

resource "aws_security_group_rule" "sg_task_egress_rule" {
  description       = "Allows task to establish connections to all resources"
  type              = "egress"
  from_port         = "0"
  to_port           = "0"
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.sg_task.id
}

# application role that the container/task runs as
resource "aws_iam_role" "app_role" {
  name               = var.name
  assume_role_policy = data.aws_iam_policy_document.app_role_assume_role_policy.json
}

resource "aws_iam_role_policy" "app_policy" {
  name   = var.name
  role   = aws_iam_role.app_role.id
  policy = data.aws_iam_policy_document.app_policy.json
}

data "aws_iam_policy_document" "app_policy" {
  statement {
    effect    = "Allow"
    actions   = ["cloudwatch:PutMetricData"]
    resources = ["*"]
  }
}

data "aws_iam_policy_document" "app_role_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_cloudwatch_log_group" "main" {
  name              = "/ecs/${var.name}"
  retention_in_days = var.logs_retention_in_days
}

resource "aws_ecs_task_definition" "main" {
  family                   = var.name
  task_role_arn            = aws_iam_role.app_role.arn
  execution_role_arn       = var.task_execution_role
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.task_size_cpu[var.task_size]
  memory                   = var.task_size_memory[var.task_size]
  container_definitions    = <<DEFINITION
  [
    {
      "name": "${var.name}",
      "image": "${var.image}",
      "essential": true,
      "portMappings": [
        {
          "containerPort": ${var.container_port},
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "PORT",
          "value": "${var.container_port}"
        },
        {
          "name": "HEALTHCHECK",
          "value": "${var.health_check_path}"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-stream-prefix": "ecs",
          "awslogs-region": "${data.aws_region.current.name}",
          "awslogs-group": "${aws_cloudwatch_log_group.main.name}"
        }
      }
    }
  ]
  DEFINITION
}

resource "aws_ecs_service" "main" {
  name                               = var.name
  cluster                            = var.cluster_name
  launch_type                        = "FARGATE"
  task_definition                    = aws_ecs_task_definition.main.arn
  desired_count                      = var.desired_count
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 50
  enable_ecs_managed_tags            = true
  propagate_tags                     = "SERVICE"

  network_configuration {
    security_groups = [aws_security_group.sg_task.id]
    subnets = var.subnet_type == "private" ? [
      var.private_subnet_one_id, var.private_subnet_two_id
    ] : [var.public_subnet_one_id, var.public_subnet_two_id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.main.id
    container_name   = var.name
    container_port   = var.container_port
  }

  depends_on = [aws_alb_listener.http]
}


resource "aws_appautoscaling_target" "app_scale_target" {
  service_namespace  = "ecs"
  scalable_dimension = "ecs:service:DesiredCount"
  resource_id        = "service/${var.cluster_name}/${aws_ecs_service.main.name}"
  min_capacity       = var.ecs_autoscale_min_instances
  max_capacity       = var.ecs_autoscale_max_instances
  role_arn           = "arn:aws:iam::${local.account_id}:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService"
}

resource "aws_cloudwatch_metric_alarm" "cpu_utilization_high" {
  alarm_name          = "${var.name}-CPU-Utilization-High-${var.ecs_as_cpu_high_threshold_per}"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = 60
  statistic           = "Average"
  threshold           = var.ecs_as_cpu_high_threshold_per
  alarm_actions       = [aws_appautoscaling_policy.app_up.arn]

  dimensions = {
    ClusterName = var.cluster_name
    ServiceName = aws_ecs_service.main.name
  }
}

resource "aws_cloudwatch_metric_alarm" "cpu_utilization_low" {
  alarm_name          = "${var.name}-CPU-Utilization-Low-${var.ecs_as_cpu_low_threshold_per}"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 1
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = 60
  statistic           = "Average"
  threshold           = var.ecs_as_cpu_low_threshold_per
  alarm_actions       = [aws_appautoscaling_policy.app_down.arn]

  dimensions = {
    ClusterName = var.cluster_name
    ServiceName = aws_ecs_service.main.name
  }
}

resource "aws_appautoscaling_policy" "app_up" {
  name               = "app-scale-up"
  service_namespace  = aws_appautoscaling_target.app_scale_target.service_namespace
  resource_id        = aws_appautoscaling_target.app_scale_target.resource_id
  scalable_dimension = aws_appautoscaling_target.app_scale_target.scalable_dimension

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 60
    metric_aggregation_type = "Average"

    step_adjustment {
      metric_interval_lower_bound = 0
      scaling_adjustment          = 1
    }
  }
}

resource "aws_appautoscaling_policy" "app_down" {
  name               = "app-scale-down"
  service_namespace  = aws_appautoscaling_target.app_scale_target.service_namespace
  resource_id        = aws_appautoscaling_target.app_scale_target.resource_id
  scalable_dimension = aws_appautoscaling_target.app_scale_target.scalable_dimension

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 300
    metric_aggregation_type = "Average"

    step_adjustment {
      metric_interval_upper_bound = 0
      scaling_adjustment          = -1
    }
  }
}
