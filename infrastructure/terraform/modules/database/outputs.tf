output "db_instance_id" {
  description = "The RDS instance ID"
  value       = aws_db_instance.main.id
}

output "db_endpoint" {
  description = "The connection endpoint"
  value       = aws_db_instance.main.endpoint
}

output "db_address" {
  description = "The hostname of the RDS instance"
  value       = aws_db_instance.main.address
}

output "db_port" {
  description = "The database port"
  value       = aws_db_instance.main.port
}

output "db_name" {
  description = "The database name"
  value       = aws_db_instance.main.db_name
}