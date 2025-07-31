#!/bin/bash

# Update system
yum update -y

# Install PostgreSQL client
amazon-linux-extras install postgresql13 -y

# Install Session Manager agent (usually pre-installed on Amazon Linux 2)
yum install -y amazon-ssm-agent
systemctl enable amazon-ssm-agent
systemctl start amazon-ssm-agent

# Create shutdown script that will run after 30 minutes
cat > /opt/auto_shutdown.sh << 'EOF'
#!/bin/bash
# Log the shutdown event
echo "$(date): Auto-shutdown initiated after 30 minutes" >> /var/log/auto-shutdown.log
# Shutdown the instance
shutdown -h now
EOF

chmod +x /opt/auto_shutdown.sh

# Create systemd service for auto-shutdown
cat > /etc/systemd/system/auto-shutdown.service << 'EOF'
[Unit]
Description=Auto shutdown after 30 minutes
After=multi-user.target

[Service]
Type=oneshot
ExecStart=/opt/auto_shutdown.sh
EOF

# Create systemd timer for auto-shutdown (30 minutes = 1800 seconds)
cat > /etc/systemd/system/auto-shutdown.timer << 'EOF'
[Unit]
Description=Auto shutdown timer (30 minutes)
Requires=auto-shutdown.service

[Timer]
OnBootSec=1800
Unit=auto-shutdown.service

[Install]
WantedBy=timers.target
EOF

# Enable and start the auto-shutdown timer
systemctl daemon-reload
systemctl enable auto-shutdown.timer
systemctl start auto-shutdown.timer

# Create a welcome script with connection info
cat > /opt/db_connect.sh << EOF
#!/bin/bash
echo "=== Database Connection Helper ==="
echo "RDS Endpoint: ${db_endpoint}"
echo "Database: shirogane"
echo "Port: 5432"
echo ""
echo "To connect to the database:"
echo "psql -h ${db_endpoint} -p 5432 -U danninn -d shirogane"
echo ""
echo "To get database password from Secrets Manager:"
echo "aws secretsmanager get-secret-value --secret-id /shirogane-holy-knights/dev/rds/credentials --query SecretString --output text | jq -r .password"
echo ""
echo "Note: This instance will auto-shutdown in 30 minutes from boot time."
echo "Current uptime: \$(uptime -p)"
EOF

chmod +x /opt/db_connect.sh

# Create MOTD (Message of the Day)
cat > /etc/motd << 'EOF'

  ╔══════════════════════════════════════════════════════════╗
  ║               Database Bastion Host                      ║
  ║                                                          ║
  ║  This instance will automatically shutdown in 30 min    ║
  ║  Run '/opt/db_connect.sh' for connection helper         ║
  ╚══════════════════════════════════════════════════════════╝

EOF

# Log completion
echo "$(date): Bastion host setup completed" >> /var/log/user-data.log