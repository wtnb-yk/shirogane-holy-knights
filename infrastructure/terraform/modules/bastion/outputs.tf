output "instance_id" {
  description = "Bastion EC2 instance ID"
  value       = aws_instance.bastion.id
}

output "security_group_id" {
  description = "Bastion security group ID"
  value       = aws_security_group.bastion.id
}

output "iam_role_arn" {
  description = "Bastion IAM role ARN"
  value       = aws_iam_role.bastion_role.arn
}

output "start_command" {
  description = "Command to start the bastion instance"
  value       = "aws ec2 start-instances --instance-ids ${aws_instance.bastion.id}"
}

output "connect_command" {
  description = "Command to connect to bastion via Session Manager"
  value       = "aws ssm start-session --target ${aws_instance.bastion.id}"
}

output "stop_command" {
  description = "Command to stop the bastion instance"
  value       = "aws ec2 stop-instances --instance-ids ${aws_instance.bastion.id}"
}