variable "environment" {
  description = "Environment name"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where NAT instances will be created"
  type        = string
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs where NAT instances will be placed"
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "List of private subnet CIDR blocks that will use NAT instances"
  type        = list(string)
}

variable "instance_type" {
  description = "EC2 instance type for NAT instances"
  type        = string
  default     = "t3.nano"
}

variable "key_pair_name" {
  description = "EC2 Key Pair name for NAT instances (optional)"
  type        = string
  default     = null
}

variable "region" {
  description = "AWS region"
  type        = string
}