terraform {
  backend "s3" {
    bucket       = "ttis-tf-state-478335820689"
    key          = "terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
