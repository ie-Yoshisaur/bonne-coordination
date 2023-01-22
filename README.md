# Bonne Coordination

This project uses docker-compose to manage the service.

## Requirements
- Docker
- docker-compose

## Usage

Clone the repository and navigate to the project root directory:

```
git clone https://github.com/e205723/bonne-coordination.git
cd bonne-coordination
```

Start the services with docker-compose:
```
docker-compose up -d
```

## Services

This project has the following services:

- web: Nginx server
- frontend: Node.js application
- backend: Go application
- db: Postgres database

## Ports

- web: 80:80
- frontend: 3000:3000
- backend: 8080:8080
- db: 5432:5432

## Environment Variables

- REACT_APP_API_URL: URL for the backend API
- POSTGRES_USER: Postgres username
- POSTGRES_PASSWORD: Postgres password
- POSTGRES_INITDB_ARGS: Arguments for initializing the Postgres database

## Deployment Workflow

This GitHub workflow is set up so that when code is pushed to the master branch, the .github/workflows/deploy.yml workflow will run and deploy the code to the production environment.

The following table describes the role of each of the environment variables stored in the repository secrets:

|Variable Name|Description|
|:----|:----|
|KNOWN_HOSTS|A list of known hosts for SSH, used for authenticating the host during SSH connection|
|POSTGRES_PASSWORD|The password for the Postgres user|
|PROXY_SSH_HOST_NAME|The hostname of the SSH proxy server|
|PROXY_SSH_PORT|The port of the SSH proxy server|
|SSH_CONFIG|The configuration file for SSH|
|SSH_HOST|The hostname of the remote server to which the code will be deployed|
|SSH_HOST_NAME|The hostname of the SSH server|
|SSH_PORT|The port of the SSH server|
|SSH_PRIVATE_KEY|The private key used for SSH authentication|
|SSH_USER|The username for the remote server to which the code will be deployed|

## Backing up and restoring data

### Backing up

In order to backup the data, you can use the following command:

```
docker-compose exec db pg_dump -Fc -U postgres -f /backup/db.dump
```

This command will create a binary file named db.dump in your current directory, which contains a backup of the data in your Postgres database.

It is recommended to set up a regular backup schedule, such as by editing the cron settings, to ensure that your data is backed up regularly and automatically after deployment. This can help prevent any data loss and ensure that you have a recent copy of your data in case of any unexpected issues.

### Restoring data

To restore the data, you can use the following command:

```
docker-compose exec db pg_restore -U postgres -C -d postgres /backup/db.dump
```

## Note
You may need to change the API_URL and other environment variables in the docker-compose.yml file according to your setup.
