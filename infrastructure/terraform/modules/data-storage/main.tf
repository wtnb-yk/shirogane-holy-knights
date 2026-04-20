# S3 bucket for danin-log.db
resource "aws_s3_bucket" "data" {
  bucket = "${var.project_name}-data"
}

resource "aws_s3_bucket_versioning" "data" {
  bucket = aws_s3_bucket.data.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "data" {
  bucket = aws_s3_bucket.data.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# IAM user for Vercel prebuild (S3 read-only)
resource "aws_iam_user" "vercel" {
  name = "${var.project_name}-vercel"
}

resource "aws_iam_user_policy" "vercel_s3_read" {
  name = "s3-read-only"
  user = aws_iam_user.vercel.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:ListBucket",
        ]
        Resource = [
          aws_s3_bucket.data.arn,
          "${aws_s3_bucket.data.arn}/*",
        ]
      }
    ]
  })
}

resource "aws_iam_access_key" "vercel" {
  user = aws_iam_user.vercel.name
}
