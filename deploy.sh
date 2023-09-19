#!/bin/bash

# Check if the script is running with root privileges
if [ "$EUID" -ne 0 ]; then
    echo "Please run this script as root or using sudo."
    exit 1
fi

# Prompt the user for the domain name
read -p "Enter the domain name for your app (e.g., example.com): " domain_name

# Verify that the domain name is not empty
if [ -z "$domain_name" ]; then
    echo "Domain name cannot be empty."
    exit 1
fi

# Prompt the user for the project directory
read -p "Enter the app directory name (e.g., myapp): " app_dir

# Verify that the app directory name is not empty
if [ -z "$app_dir" ]; then
    echo "App directory name cannot be empty."
    exit 1
fi

# Prompt the user for the source directory path
read -p "Enter the source directory path (e.g., /path/to/your/app): " source_dir

# Verify that the source directory exists
if [ ! -d "$source_dir" ]; then
    echo "Source directory '$source_dir' does not exist."
    exit 1
fi

# Define the project directory
project_dir="/var/www/$app_dir"

# Verify if the project directory exists
if [ ! -d "$project_dir" ]; then
    echo "Creating the project directory '$project_dir'..."
    mkdir -p "$project_dir"
    
    # Copy the project from the source directory to the project directory
    echo "Copying the project from '$source_dir' to '$project_dir'..."
    cp -r "$source_dir"/* "$project_dir"
fi

# Navigate to the project directory
cd "$project_dir"

# Install Node Version Manager (nvm)
echo "Installing Node Version Manager (nvm)..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

# Load nvm into the current shell session
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 16 and set it as the default version
echo "Installing Node.js 16..."
nvm install 16
nvm alias default 16

# Install project dependencies
echo "Installing project dependencies..."
npm install

# Install PM2 globally
npm install pm2 -g

# Start your Node.js app with PM2
read -p "Enter the port number for your Node.js app (e.g., 3000): " app_port

# Verify that the port number is not empty
if [ -z "$app_port" ]; then
    echo "Port number cannot be empty."
    exit 1
fi

echo "Starting your Node.js app with PM2 on port $app_port..."
pm2 start app.js --name myapp -- --port $app_port

# Install Nginx
echo "Installing Nginx..."
apt-get update
apt-get install -y nginx

# Set up Nginx configuration
echo "Setting up Nginx configuration..."

# Create an Nginx server block configuration file
nginx_conf="/etc/nginx/sites-available/$app_dir"
cat > "$nginx_conf" <<EOL
server {
    listen 80;
    server_name $domain_name www.$domain_name;

    location / {
        proxy_pass http://127.0.0.1:$app_port;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Add other Nginx configuration here if needed
}

EOL

# Create a symbolic link to enable the server block
ln -s "$nginx_conf" "/etc/nginx/sites-enabled/"

# Test Nginx configuration and reload Nginx
nginx -t
systemctl reload nginx

echo "Nginx configuration is set up."

# Provide information to the user
echo "Your Node.js app is now deployed using PM2 and Nginx."
echo "Make sure to configure your DNS settings to point to your server's IP address."
