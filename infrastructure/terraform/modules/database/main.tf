# DB Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-db-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "${var.project_name}-${var.environment}-db-subnet-group"
  }
}

# DB Parameter Group
resource "aws_db_parameter_group" "main" {
  name   = "${var.project_name}-${var.environment}-db-params"
  family = "postgres15"
  
  lifecycle {
    ignore_changes = [name]
  }

  parameter {
    name         = "shared_preload_libraries"
    value        = "pg_stat_statements"
    apply_method = "pending-reboot"
  }

  parameter {
    name  = "log_statement"
    value = "all"
  }

  parameter {
    name  = "log_duration"
    value = "1"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-db-params"
  }
}

# Get RDS credentials from Secrets Manager
data "aws_secretsmanager_secret_version" "db_credentials" {
  count     = var.use_secrets_manager ? 1 : 0
  secret_id = var.db_secret_arn
}

locals {
  db_credentials = var.use_secrets_manager ? jsondecode(data.aws_secretsmanager_secret_version.db_credentials[0].secret_string) : {}
  db_username    = var.use_secrets_manager ? try(local.db_credentials.username, var.db_username) : var.db_username
  db_password    = var.use_secrets_manager ? try(local.db_credentials.password, var.db_password) : var.db_password
}

# RDS Instance
resource "aws_db_instance" "main" {
  identifier = "${var.project_name}-${var.environment}-db"

  engine         = "postgres"
  engine_version = var.db_engine_version
  instance_class = var.db_instance_class

  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  storage_type          = var.db_storage_type
  storage_encrypted     = true

  db_name  = var.db_name
  username = local.db_username
  password = local.db_password

  vpc_security_group_ids = var.vpc_security_group_ids
  db_subnet_group_name   = aws_db_subnet_group.main.name
  parameter_group_name   = aws_db_parameter_group.main.name

  backup_retention_period = var.backup_retention_period
  backup_window          = var.backup_window
  maintenance_window     = var.maintenance_window

  skip_final_snapshot       = var.skip_final_snapshot
  final_snapshot_identifier = var.skip_final_snapshot ? null : "${var.project_name}-${var.environment}-db-final-snapshot-${formatdate("YYYYMMDDHHmmss", timestamp())}"

  enabled_cloudwatch_logs_exports = ["postgresql"]

  apply_immediately = var.apply_immediately

  # パブリックアクセス設定（DBクライアントからの接続用）
  publicly_accessible = var.publicly_accessible

  tags = {
    Name = "${var.project_name}-${var.environment}-db"
  }
}