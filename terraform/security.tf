# CIS AWS Benchmark 4.3: VPC default SG should permit no traffic.
# Adopting the resource without ingress/egress blocks strips its rules.
# Resource-specific SGs (cluster, node, RDS) live with those resources in 3c/3d.
resource "aws_default_security_group" "default" {
  vpc_id = module.vpc.vpc_id
}
