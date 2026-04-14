-- Drop indexes related to columns being removed
DROP INDEX IF EXISTS idx_video_details_view_count;
DROP INDEX IF EXISTS idx_content_details_members_only;
DROP INDEX IF EXISTS idx_content_details_live_content;

-- Remove unnecessary updated_at columns
ALTER TABLE channels DROP COLUMN updated_at;
ALTER TABLE content_details DROP COLUMN updated_at;
ALTER TABLE video_details DROP COLUMN updated_at;
ALTER TABLE videos DROP COLUMN updated_at;

-- Remove unnecessary columns from channels
ALTER TABLE channels DROP COLUMN subscriber_count;

-- Remove unnecessary columns from tags
ALTER TABLE tags DROP COLUMN color;

-- Remove unnecessary columns from video_details
ALTER TABLE video_details DROP COLUMN view_count;
ALTER TABLE video_details DROP COLUMN like_count;

-- Remove unnecessary columns from content_details
ALTER TABLE content_details DROP COLUMN is_members_only;
ALTER TABLE content_details DROP COLUMN is_premiered;
ALTER TABLE content_details DROP COLUMN is_live_content;