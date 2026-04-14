output "nat_instance_ids" {
  description = "List of NAT instance IDs"
  value       = aws_instance.nat_instance[*].id
}

output "nat_instance_network_interface_ids" {
  description = "List of NAT instance primary network interface IDs"
  value       = aws_instance.nat_instance[*].primary_network_interface_id
}

output "security_group_id" {
  description = "Security group ID for NAT instances"
  value       = aws_security_group.nat_instance.id
}