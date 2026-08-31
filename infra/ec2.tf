# --- SSH用キーペア（Terraformで秘密鍵を新規生成し、ローカルに保存する） ---

resource "tls_private_key" "ec2" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "ec2" {
  key_name   = "trello-clone-key"
  public_key = tls_private_key.ec2.public_key_openssh
}

resource "local_file" "ec2_private_key" {
  content         = tls_private_key.ec2.private_key_pem
  filename        = "${path.module}/trello-clone-key.pem"
  file_permission = "0400"
}

# --- 最新の Amazon Linux 2023 AMI を自動取得 ---

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# --- EC2インスタンス本体 ---

resource "aws_instance" "app" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = "t3.micro"
  subnet_id                   = aws_subnet.public_a.id
  vpc_security_group_ids      = [aws_security_group.ec2.id]
  key_name                    = aws_key_pair.ec2.key_name
  associate_public_ip_address = true

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  # Dockerを起動時に自動インストールしておく（イメージはローカルでビルドしdocker runで起動するため、Docker Composeは不要）
  user_data = <<-EOF
    #!/bin/bash
    dnf update -y
    dnf install -y docker
    systemctl enable docker
    systemctl start docker
    usermod -aG docker ec2-user
  EOF

  tags = { Name = "trello-clone-app" }
}

# --- Elastic IP（固定IP。EC2稼働中は無料） ---

resource "aws_eip" "app" {
  domain   = "vpc"
  instance = aws_instance.app.id

  tags = { Name = "trello-clone-app" }
}
