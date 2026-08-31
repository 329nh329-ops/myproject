variable "aws_region" {
  description = "デプロイ先のAWSリージョン"
  type        = string
  default     = "ap-northeast-1"
}

variable "my_ip_cidr" {
  description = "SSH接続を許可する自分のグローバルIP（CIDR形式、例: 1.2.3.4/32）"
  type        = string
}

variable "db_password" {
  description = "RDS(PostgreSQL)のマスターパスワード"
  type        = string
  sensitive   = true
}
