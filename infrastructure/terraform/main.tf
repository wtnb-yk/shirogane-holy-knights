module "data_storage" {
  source = "./modules/data-storage"

  project_name = var.project_name
}

module "secrets" {
  source = "./modules/secrets"

  project_name = var.project_name
}

module "data_pipeline" {
  source = "./modules/data-pipeline"

  project_name       = var.project_name
  lambda_zip_path    = var.lambda_zip_path
  s3_bucket_name     = module.data_storage.bucket_name
  s3_bucket_arn      = module.data_storage.bucket_arn
  youtube_secret_arn     = module.secrets.youtube_api_secret_arn
  deploy_hook_secret_arn = module.secrets.deploy_hook_secret_arn
}
