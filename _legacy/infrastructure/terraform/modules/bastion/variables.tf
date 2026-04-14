variable "environment" {
  description = "Environment name"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "subnet_id" {
  description = "Subnet ID for bastion host (should be private subnet)"
  type        = string
}

variable "vpc_endpoint_subnet_ids" {
  description = "Subnet IDs for VPC endpoints (should be private subnets)"
  type        = list(string)
}

variable "instance_type" {
  description = "EC2 instance type for bastion host"
  type        = string
  default     = "t3.nano"
}

variable "db_endpoint" {
  description = "RDS endpoint for database connection"
  type        = string
}