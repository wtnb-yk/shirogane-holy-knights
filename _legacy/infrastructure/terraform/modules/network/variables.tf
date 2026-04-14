variable "environment" {
  description = "Environment name"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
}

variable "azs" {
  description = "Availability zones"
  type        = list(string)
}

variable "public_subnets" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
}

variable "private_subnets" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
}

variable "enable_nat_gateway" {
  description = "Enable NAT Gateway for private subnets"
  type        = bool
  default     = true
}

variable "enable_nat_instance" {
  description = "Enable NAT Instance for private subnets"
  type        = bool
  default     = false
}

variable "nat_instance_type" {
  description = "EC2 instance type for NAT instances"
  type        = string
  default     = "t3.nano"
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-1"
}

variable "allowed_db_client_cidrs" {
  description = "CIDR blocks allowed to access database from external clients"
  type        = list(string)
  default     = null
}

variable "bastion_security_group_id" {
  description = "Security group ID of the bastion host"
  type        = string
  default     = null
}