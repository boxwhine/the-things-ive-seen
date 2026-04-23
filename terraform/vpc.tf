data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  azs      = slice(data.aws_availability_zones.available.names, 0, 3)
  vpc_cidr = "10.0.0.0/16"
}

# See ADR-0013 (community module choice) and ADR-0014 (single-NAT) for the WHY.
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 6.0"

  name = "${var.project_name}-${var.environment}-vpc"
  cidr = local.vpc_cidr
  azs  = local.azs

  # /20 per subnet = 4,091 usable IPs each. 3 AZs x 3 tiers = 9 subnets.
  private_subnets  = ["10.0.0.0/20", "10.0.16.0/20", "10.0.32.0/20"]
  public_subnets   = ["10.0.48.0/20", "10.0.64.0/20", "10.0.80.0/20"]
  database_subnets = ["10.0.96.0/20", "10.0.112.0/20", "10.0.128.0/20"]

  enable_nat_gateway     = true
  single_nat_gateway     = true
  one_nat_gateway_per_az = false

  enable_dns_hostnames = true
  enable_dns_support   = true

  create_database_subnet_group = true

  # AWS Load Balancer Controller subnet discovery (in-tree convention).
  public_subnet_tags  = { "kubernetes.io/role/elb" = "1" }
  private_subnet_tags = { "kubernetes.io/role/internal-elb" = "1" }
}
