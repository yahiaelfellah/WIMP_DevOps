
# Guide for Deploying the System on Raspberry Pi (RPI)


##  Step 1 : Pull the sources

1. In order to pull the repository, you must ask an admin for a Github access token.

2. Once you have your access token, you can simply pull the repository:

```bash
git clone https://github.com/yahiaelfellah/WIMP_DevOps.git
```

3. Navigate to the cloned repository:

```bash
cd ./WIMP_DevOps/
```
## Step 2 : Install Dependencies  

### Overview

Lerna is a tool for managing JavaScript projects with multiple packages. It can be particularly helpful when dealing with monorepositories containing multiple interconnected packages. This guide outlines the process of using Lerna to manage and install packages in a project.

### Prerequisites

Before you begin, ensure that you have the following prerequisites in place:

- Node.js and npm installed on your system.

###  Initialize the Project

1. Navigate to the root directory of your project in your terminal.

2. Run the following command to initialize Lerna in your project:

   ```bash 
    npm install -g yarn
    ```

   ```bash
   yarn install 
   ```
This command will create a lerna.json configuration file in your project.


## Step 3 : Installing Docker and Docker-Compose 

After using Docker on several Raspberry Pi's and on my main home server, I wanted to add some more power to my test environment. So I bought the 4GB Raspberry Pi 4 with an overpriced power adapter: PoE HAT. It costs about 225% of the regular power adapter. Yet as all my switches are equipped with PoE, makes this a lot nicer and cooler to use #nerdmode.

### 1 - Installing Docker and Docker-Compose

While I never had any issues installing Docker and Docker-Compose, I did notice some issues with Python version 2.x and 3.x. While both versions were installed, Docker-Compose wouldn't install by any means. So after several clean installs on my newly Raspberry Pi 4, I figured out how to avoid this version conflict.

#### Simple Installation Steps

For installing Docker and Docker-Compose, I use the following simple steps/commands. First of all, I make sure that the Raspberry Pi is up to date:

```bash
$ sudo apt update && sudo apt upgrade -y && sudo apt dist-upgrade -y
```

With raspi-config, I change the hostname into something that I can remember. For me, this is now dockerpi. When it's booted, I can use dockerpi.local instead of the IP address.

After updating, I use these commands to install Docker, Docker-Compose, and some required/preferred packages. Notice that I want to uninstall python-configparser as that caused some issues in previous installations. Now you most probably will get the notification that it isn't installed, as I directly install Python3 and Pip3:

```bash
$ sudo apt update && sudo apt upgrade -y
$ curl -sSL https://get.docker.com | sh
$ sudo usermod -aG docker pi
$ sudo apt install libffi-dev libssl-dev python3 python3-pip
$ sudo apt remove python-configparser
$ sudo pip3 install docker-compose
$ reboot
```

The reboot is only required to be able to execute Docker commands as a normal Pi user without the sudo command.

#### Installing Portainer and a Default Network

After the reboot, you should have a fully working Docker environment. I personally always install Portainer on Docker, as this gives you a nice web interface. I also create a default network within Docker to place all containers in the same network. A lesson that I've learned "the hard way". I ended up with almost each container creating its own network, ending up having 20+ networks:

```bash
$ docker volume create portainer_data
$ docker run -d -p 8000:8000 -p 9000:9000 --restart unless-stopped --name="Portainer" -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer
$ docker network create docker
```

After installation, go to the Portainer page [http://dockerpi.local:9000](http://dockerpi.local:9000) or [http://<ip-of-the-pi>:9000](http://<ip-of-the-pi>:9000).

Here you can configure your account. I'd prefer not to use "admin" as a username. Use a different username and your desired password.

The next step is to configure how to use Portainer. As I use it as a local test setup, this would be my choice:
```

You can copy and paste this Markdown content into a `.md` file for documentation purposes.
## Configuration of the Database
https://www.zuidwijk.com/installing-docker-and-docker-compose-on-a-raspberry-pi-4/
### Check if the Database User Exists and Can Connect

In MySQL, each database user is defined with an IP address in it, allowing or restricting connections from specific sources. If you're using a container, you might not be able to access the database from 127.0.0.1, potentially causing connection issues. Here's how to check and resolve this:

1. From a terminal, connect to your MySQL running container:
   ```bash
   docker exec -it your_container_name_or_id bash
   ```

2. Inside your container, connect to the MySQL database:
   ```bash
   mysql -u your_user -p
   ```
   You will be prompted to enter your password; type it and press Enter.

3. In your MySQL database, execute the following SQL script to list all existing database users:
   ```sql
   SELECT host, user FROM mysql.user;
   ```
   This will display a table with user-host combinations. It should contain a line with your database user and '%' (which means "every IP address is allowed"). For example:

   ```
   +------------+------------------+
   | host       | user             |
   +------------+------------------+
   | %          | root             |
   +------------+------------------+
   ```

   If you see your user listed as '%' (allowing all IP addresses), your root user can connect itself from any IP address.

#### Are External Connections Allowed?

If you suspect that external connections to the container are not allowed, you can verify it as follows:

1. From a terminal, connect to your MySQL running container:
   ```bash
   docker exec -it your_container_name_or_id bash
   ```

2. In your container, run this command to check the bind address configuration:
   ```bash
   mysqld --verbose --help | grep bind-address
   ```

   The output should display the bind address as 0.0.0.0, which means it allows connections from all IP addresses. Example output:

   ```
   --bind-address=name  IP address to bind to.
   bind-address                                                 0.0.0.0
   ```

   If the bind address is not 0.0.0.0, you may need to update the MySQL configuration to allow external connections.

**Note:**
When using docker-compose and linking a volume, the parameters

```yaml
environment:
   MYSQL_ROOT_PASSWORD: 'pass'
   MYSQL_DATABASE: 'db'
   MYSQL_USER: 'user'
   MYSQL_PASSWORD: 'pass'
```

in your docker-compose.yml will not be used, so the default user will not be created. You may need to create the user manually or remove the volume declaration.


### 3 - Run docker-compose 

you can run now the docker compose command in order to deploy the service  

```back 
docker-compose -f .\docker-compose.yml up  --build
```


### 4 - Granting MariaDB Root User Access from Any IP Address

To grant privileges to the MariaDB root user to allow connections from any IP address ('%'), follow these steps:

1. **Access Your MariaDB Server**: Log in to your MariaDB server as the root user using a command-line client or a database management tool like phpMyAdmin. You typically need administrative access to perform this operation.

2. **Switch to the MariaDB Database**: Run the following command to switch to the MariaDB database:

   ```sql
   USE mysql;
   ```

3. **Grant Permissions to the Root User**: Run the following SQL command to grant permissions to the root user from all hosts ('%'):

   ```sql
   GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'your_root_password' WITH GRANT OPTION;
   ```

   Replace `'your_root_password'` with your actual root user password.

4. **Flush Privileges**: After granting privileges, run the following command to apply the changes:

   ```sql
   FLUSH PRIVILEGES;
   ```

5. **Exit the MySQL Shell**: You can now exit the MySQL shell.

6. **Restart MariaDB (if necessary)**: Depending on your MariaDB server's configuration, you may need to restart the MariaDB service for the changes to take effect. You can do this with a command like:

   ```bash
   sudo systemctl restart mariadb
   ```

Please exercise extreme caution when granting privileges to the root user from all IP addresses ('%'). This configuration allows the root user to connect from any location, potentially exposing your database to security risks. It's recommended to use strong passwords, firewall rules, and other security measures to protect your database in such scenarios.

### 5 - Create DB for your services  

#### Resolving "Unknown database" Error in Sequelize

If you encounter the error message "Unknown database 'WIMPv2_users'" when using Sequelize, it means that Sequelize is unable to connect to the specified database because it doesn't exist in your MariaDB server. To resolve this issue, follow these steps:


## Step 4: Create the Database Manually

You need to create the database 'WIMPv2_users' in your MariaDB server manually. You can use a database management tool like phpMyAdmin, a MySQL command-line client, or any other suitable method to create the database. Here's how you can create it using the command-line client:

```bash
mariadb -u root -p
```

After entering your root password, you can create the database -- i.e  ` WIMPv2_users `:

```sql
CREATE DATABASE WIMPv2_users;
```

This Markdown file provides a guide for deploying a system on a Raspberry Pi (RPI), including the configuration of the database and checking the existence of database users and their connection permissions. It also includes instructions for granting MariaDB root user access from any IP address for external connections.

