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

output "instance_connect_endpoint_id" {
  description = "EC2 Instance Connect Endpoint ID"
  value       = aws_ec2_instance_connect_endpoint.bastion.id
}

output "connect_command" {
  description = "Command to connect to bastion via Instance Connect"
  value       = "aws ec2-instance-connect ssh --instance-id ${aws_instance.bastion.id} --instance-connect-endpoint-id ${aws_ec2_instance_connect_endpoint.bastion.id}"
}

output "stop_command" {
  description = "Command to stop the bastion instance"
  value       = "aws ec2 stop-instances --instance-ids ${aws_instance.bastion.id}"
}