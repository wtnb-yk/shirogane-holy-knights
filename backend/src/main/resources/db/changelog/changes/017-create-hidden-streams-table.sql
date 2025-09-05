-- Create hidden_streams table
CREATE TABLE hidden_streams (
    video_id VARCHAR(255) PRIMARY KEY,
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);

-- Add index for performance
CREATE INDEX idx_hidden_streams_video_id ON hidden_streams(video_id);