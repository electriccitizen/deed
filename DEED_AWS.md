# DEED Drupal install / Dockerfile

The Dockerfile incorporates several best practices to ensure performance, security, and minimal image size:

- **Multi-Stage Build:** Dependencies are built in a temporary stage (using Composer), and only the necessary application files are copied into a minimal runtime image.
- **Alpine Linux Base:** Using Alpine provides a small, secure base for PHP-FPM.
- **Single-Process Execution:** The container runs only PHP-FPM in the foreground (required for Fargate health checks & lifecycle).

## Components & AWS Mapping

| Component               | AWS Service/Requirement | Task Definition Action                                | Container Path/Port                                   |
|-------------------------|-------------------------|--------------------------------------------------------|-------------------------------------------------------|
| Web Server / Proxy      | NGINX sidecar    | Route dynamic traffic to FPM port                      | **EXPOSE 9000** (PHP-FPM listener)                    |
| Persistent File Storage | Amazon EFS              | Define EFS volume and mount point in Task Definition   | Mount target: `/var/www/html/web/sites/default/files` |
| Database Connection     | Amazon RDS (MariaDB)    | Inject connection params as secure env vars            | Access via vars (e.g., `RDS_HOSTNAME`) – see below    |
| Container User          | Security / EFS write    | Image runs as `www-data` with fixed permissions        | No action required; baked into image (`chmod 775`)    |

---

## Database Connection and Environment Variables

The Drupal database connection must be defined dynamically using environment variables provided by Fargate.

| Environment Variable | Drupal Config Role                                        |
|----------------------|-----------------------------------------------------------|
| `RDS_HOSTNAME`       | Database Host (e.g., `db-instance-1.rds.amazonaws.com`)  |
| `RDS_USERNAME`       | Database Username                                         |
| `RDS_PASSWORD`       | Database Password                                         |
| `RDS_DB_NAME`        | Database Name                                             |
| `DRUPAL_HASH_SALT`   | Unique Site Hash Salt (**CRITICAL**)                      |
