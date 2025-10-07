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

| Env Variable           | Drupal Config Role | Rationale |
|:-----------------------| :--- | :--- |
| `RDS_HOSTNAME`         | Database Host | Connects to the RDS endpoint. |
| `RDS_USERNAME`         | Database Username | Access credential. |
| `RDS_PASSWORD`         | Database Password | Access credential (Best sourced from AWS Secrets Manager). |
| `RDS_DB_NAME`          | Database Name | Specifies the target database instance. |
| `DRUPAL_HASH_SALT`     | Unique Site Hash Salt | **CRITICAL:** Required for security and session management. Must be long and unique. |
| `APP_ENV`              | Application Environment Indicator | **NEW:** Used for activating specific configuration splits (e.g., `dev`, `prod`, `uat`). |
| `TRUSTED_HOST_PATTERN` | Trusted Host Security | **CRITICAL MISSING SECURITY SETTING:** Must match the domain name(s) used by the AWS Load Balancer (e.g., `^example\.com$`). |
