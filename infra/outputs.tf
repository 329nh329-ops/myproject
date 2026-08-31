output "ec2_public_ip" {
  description = "EC2インスタンスの固定パブリックIP"
  value       = aws_eip.app.public_ip
}

output "ssh_command" {
  description = "SSH接続コマンド"
  value       = "ssh -i infra/trello-clone-key.pem ec2-user@${aws_eip.app.public_ip}"
}

output "rds_endpoint" {
  description = "RDS(PostgreSQL)の接続エンドポイント"
  value       = aws_db_instance.postgres.address
}
