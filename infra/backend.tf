# バケット名等の実際の値は backend.hcl（Git管理対象外）に書き、
# `terraform init -backend-config=backend.hcl` で読み込む。
terraform {
  backend "s3" {
    key    = "trello-clone/terraform.tfstate"
    region = "ap-northeast-1"
  }
}
