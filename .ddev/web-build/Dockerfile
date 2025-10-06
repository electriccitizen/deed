# File: .ddev/web-build/Dockerfile

# --- STRATEGIC PIVOT: Use the official DDEV image as the base. ---
# This is the standard, documented approach for custom DDEV builds.
# DDEV injects the correct image tag (e.g., ddev/ddev-webserver:v1.24.8)
# into the BASE_IMAGE argument based on the project's config.yaml.
ARG BASE_IMAGE
FROM $BASE_IMAGE

# This single RUN instruction installs all necessary PHP extensions for Drupal.
# We are now using the DDEV environment variable $DDEV_PHP_VERSION to prefix
# the package names (e.g., php${DDEV_PHP_VERSION}-gd), which is required
# for extensions sourced from deb.sury.org (DDEV's package provider).
RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        # PHP runtime extensions required for Drupal on Debian.
        # Note the use of $DDEV_PHP_VERSION for version-specific packages.
        php${DDEV_PHP_VERSION}-mysql \
        php${DDEV_PHP_VERSION}-pgsql \
        php${DDEV_PHP_VERSION}-opcache \
        php${DDEV_PHP_VERSION}-gd \
        php${DDEV_PHP_VERSION}-intl \
        php${DDEV_PHP_VERSION}-zip \
        php${DDEV_PHP_VERSION}-xml \
        php${DDEV_PHP_VERSION}-mbstring \
    \
    # Cleanup: Clear the package cache to reduce image size.
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# NOTE: No DDEV Startup Fixes, CMD, or directory creations are needed here.
# The base image handles all necessary DDEV logic and runtime utilities.
