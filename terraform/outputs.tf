output "vpc_id" {
  description = "ID of the VPC. Consumed by EKS (3c) and RDS (3d) module/resource calls."
  value       = module.vpc.vpc_id
}

output "vpc_cidr_block" {
  description = "Primary IPv4 CIDR of the VPC."
  value       = module.vpc.vpc_cidr_block
}

output "private_subnet_ids" {
  description = "Private subnet IDs (EKS worker nodes land here in 3c)."
  value       = module.vpc.private_subnets
}

output "public_subnet_ids" {
  description = "Public subnet IDs (NLB and NAT GW land here)."
  value       = module.vpc.public_subnets
}

output "database_subnet_ids" {
  description = "Database subnet IDs (RDS lands here in 3d)."
  value       = module.vpc.database_subnets
}

output "database_subnet_group_name" {
  description = "Name of the RDS subnet group, consumed directly by aws_db_instance.db_subnet_group_name in 3d."
  value       = module.vpc.database_subnet_group_name
}

output "azs" {
  description = "Availability zones the VPC spans."
  value       = module.vpc.azs
}

output "nat_public_ips" {
  description = "Public IPs of the NAT gateway(s). Useful for IP allowlists on outbound integrations and as a stable egress identity."
  value       = module.vpc.nat_public_ips
}
