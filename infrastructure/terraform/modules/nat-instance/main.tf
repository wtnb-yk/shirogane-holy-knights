# Data source for Amazon Linux 2 AMI (to configure as NAT)
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Security Group for NAT Instance
resource "aws_security_group" "nat_instance" {
  name_prefix = "${var.project_name}-${var.environment}-nat-instance-"
  vpc_id      = var.vpc_id

  # Allow all traffic from private subnets
  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = var.private_subnet_cidrs
  }

  # Allow all outbound traffic to internet
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-nat-instance-sg"
  }
}

# NAT Instance
resource "aws_instance" "nat_instance" {
  count                   = length(var.public_subnet_ids)
  ami                     = data.aws_ami.amazon_linux.id
  instance_type           = var.instance_type
  key_name                = var.key_pair_name
  subnet_id               = var.public_subnet_ids[count.index]
  vpc_security_group_ids  = [aws_security_group.nat_instance.id]
  source_dest_check       = false
  iam_instance_profile    = aws_iam_instance_profile.nat_instance.name

  user_data = base64encode(<<-EOF
    #!/bin/bash
    yum update -y
    yum install -y iptables-services
    echo 'net.ipv4.ip_forward = 1' >> /etc/sysctl.conf
    sysctl -p /etc/sysctl.conf
    
    # Configure NAT
    /sbin/iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
    /sbin/iptables -F FORWARD
    /sbin/service iptables save
    chkconfig iptables on
  EOF
  )

  tags = {
    Name = "${var.project_name}-${var.environment}-nat-instance-${count.index + 1}"
  }
}


# IAM Role for NAT Instance (既存のロールを参照)
data "aws_iam_role" "nat_instance" {
  name = "${var.project_name}-${var.environment}-nat-instance-role"
}

# IAM Policy for NAT Instance
resource "aws_iam_role_policy" "nat_instance" {
  name = "${var.project_name}-${var.environment}-nat-instance-policy"
  role = data.aws_iam_role.nat_instance.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ec2:ModifyInstanceAttribute",
          "ec2:DescribeInstances"
        ]
        Resource = "*"
      }
    ]
  })
}

# IAM Instance Profile
resource "aws_iam_instance_profile" "nat_instance" {
  name = "${var.project_name}-${var.environment}-nat-instance-profile"
  role = data.aws_iam_role.nat_instance.name
}

