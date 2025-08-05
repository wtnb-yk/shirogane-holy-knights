# Data source for the latest Amazon Linux 2 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# IAM role for Session Manager
resource "aws_iam_role" "bastion_role" {
  name = "${var.project_name}-${var.environment}-bastion-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-bastion-role"
  }
}

# Attach AWS managed policy for Session Manager
resource "aws_iam_role_policy_attachment" "bastion_ssm_policy" {
  role       = aws_iam_role.bastion_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# Instance profile for the bastion host
resource "aws_iam_instance_profile" "bastion_profile" {
  name = "${var.project_name}-${var.environment}-bastion-profile"
  role = aws_iam_role.bastion_role.name
}

# Security group for bastion host
resource "aws_security_group" "bastion" {
  name_prefix = "${var.project_name}-${var.environment}-bastion-"
  vpc_id      = var.vpc_id

  # SSH access from Instance Connect Endpoint
  ingress {
    from_port                = 22
    to_port                  = 22
    protocol                 = "tcp"
    source_security_group_id = aws_security_group.instance_connect_endpoint.id
    description              = "SSH access from Instance Connect Endpoint"
  }

  # Only outbound traffic (for DB access)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-bastion-sg"
  }
}

# User data script for bastion host
locals {
  user_data = base64encode(templatefile("${path.module}/user_data.sh", {
    db_endpoint = var.db_endpoint
  }))
}

# Bastion EC2 instance
resource "aws_instance" "bastion" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [aws_security_group.bastion.id]
  iam_instance_profile   = aws_iam_instance_profile.bastion_profile.name

  user_data = local.user_data

  # Start in stopped state to save costs
  # Users will start it manually when needed
  tags = {
    Name = "${var.project_name}-${var.environment}-bastion"
  }

  lifecycle {
    ignore_changes = [
      # Ignore AMI changes to prevent unnecessary instance replacement
      ami,
      user_data
    ]
  }
}

# EC2 Instance Connect Endpoint (無料のSSHアクセス)
resource "aws_ec2_instance_connect_endpoint" "bastion" {
  subnet_id          = var.subnet_id
  security_group_ids = [aws_security_group.instance_connect_endpoint.id]

  tags = {
    Name = "${var.project_name}-${var.environment}-instance-connect-endpoint"
  }
}

# Security group for EC2 Instance Connect Endpoint
resource "aws_security_group" "instance_connect_endpoint" {
  name_prefix = "${var.project_name}-${var.environment}-ice-"
  vpc_id      = var.vpc_id

  # SSHアクセスを許可
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH access via Instance Connect Endpoint"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-ice-sg"
  }
}

# VPC Endpoints for Session Manager (required for private subnet)
# コスト削減のため一時的にコメントアウト - EC2 Instance Connect Endpointを使用中
# resource "aws_vpc_endpoint" "ssm" {
#   vpc_id              = var.vpc_id
#   service_name        = "com.amazonaws.${var.aws_region}.ssm"
#   vpc_endpoint_type   = "Interface"
#   subnet_ids          = var.vpc_endpoint_subnet_ids
#   security_group_ids  = [aws_security_group.vpc_endpoints.id]
#   private_dns_enabled = true
# 
#   tags = {
#     Name = "${var.project_name}-${var.environment}-ssm-endpoint"
#   }
# }
# 
# resource "aws_vpc_endpoint" "ssmmessages" {
#   vpc_id              = var.vpc_id
#   service_name        = "com.amazonaws.${var.aws_region}.ssmmessages"
#   vpc_endpoint_type   = "Interface"
#   subnet_ids          = var.vpc_endpoint_subnet_ids
#   security_group_ids  = [aws_security_group.vpc_endpoints.id]
#   private_dns_enabled = true
# 
#   tags = {
#     Name = "${var.project_name}-${var.environment}-ssmmessages-endpoint"
#   }
# }
# 
# resource "aws_vpc_endpoint" "ec2messages" {
#   vpc_id              = var.vpc_id
#   service_name        = "com.amazonaws.${var.aws_region}.ec2messages"
#   vpc_endpoint_type   = "Interface"
#   subnet_ids          = var.vpc_endpoint_subnet_ids
#   security_group_ids  = [aws_security_group.vpc_endpoints.id]
#   private_dns_enabled = true
# 
#   tags = {
#     Name = "${var.project_name}-${var.environment}-ec2messages-endpoint"
#   }
# }
# 
# # Security group for VPC endpoints
# resource "aws_security_group" "vpc_endpoints" {
#   name_prefix = "${var.project_name}-${var.environment}-vpc-endpoints-"
#   vpc_id      = var.vpc_id
# 
#   ingress {
#     from_port       = 443
#     to_port         = 443
#     protocol        = "tcp"
#     security_groups = [aws_security_group.bastion.id]
#   }
# 
#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }
# 
#   tags = {
#     Name = "${var.project_name}-${var.environment}-vpc-endpoints-sg"
#   }
# }