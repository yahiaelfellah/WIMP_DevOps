#!/bin/bash 
sudo apt update
sudo apt upgrade

# Install the MongoDB 4.4 GPG key:
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -

# Add the source location for the MongoDB packages:
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

# Download the package details for the MongoDB packages:
sudo apt-get update

# Install MongoDB:
sudo apt-get install -y mongodb-org

# Ensure mongod config is picked up:
sudo systemctl daemon-reload

# Tell systemd to run mongod on reboot:
sudo systemctl enable mongod

# Start up mongod!
sudo systemctl start mongod


# Edit the MongoDB configuration file.
sudo nano /etc/mongod.conf
# Add the following lines under 'security:' (uncomment if necessary).
# security:
#    authorization: enabled
# Save the file and exit the editor.

# Change the 'bindIp' to '0.0.0.0'.
sudo sed -i 's/#  bindIp: 127.0.0.1/bindIp: 0.0.0.0/' /etc/mongod.conf

# Restart MongoDB.
sudo systemctl restart mongod

# Open port 27017 in the Raspberry Pi's firewall (optional).
echo "Opening port 27017 in the firewall (optional)..."
sudo ufw allow 27017/tcp

echo "MongoDB setup completed!"
In this updated script, we're using the sed command to replace the 'bindIp' line in the /etc/mongod.conf file, changing it from the default '127.0.0.1' to '0.0.0.0'. This allows MongoDB to listen on all network interfaces. After making this change, MongoDB is accessible from any IP address on the network, which can be a security risk, so please ensure that your Raspberry Pi is adequately secured, and consider network firewall rules accordingly.





