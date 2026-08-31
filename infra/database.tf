resource "aws_db_subnet_group" "main" {
  name       = "trello-clone-db"
  subnet_ids = [aws_subnet.public_a.id, aws_subnet.public_c.id]

  tags = { Name = "trello-clone-db" }
}

resource "aws_db_instance" "postgres" {
  identifier     = "trello-clone-db"
  engine         = "postgres"
  engine_version = "18"
  instance_class = "db.t4g.micro" # RDS無料利用枠の対象クラス（サインアップから6ヶ月間）

  allocated_storage = 20 # RDSストレージの無料利用枠上限（20GB）
  storage_type      = "gp2"

  db_name  = "trello_clone"
  username = "postgres"
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  publicly_accessible = false # EC2経由（同一VPC内）のみアクセス可能
  multi_az            = false # 無料枠はSingle-AZのみ対象

  skip_final_snapshot = true # 学習用途のため。destroy時にスナップショットを残さない
  deletion_protection = false
}
