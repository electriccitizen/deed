# --------------------------------------------------------------------------------
# STAGE 1: BUILDER (The "Heavy" Stage - Used for dependencies, then discarded)
# --------------------------------------------------------------------------------

# Use a PHP CLI image with Composer pre-installed and Alpine base for smaller build caches
FROM composer:2.7 as builder

# Set the working directory for the application code
WORKDIR /app

# Copy Composer files
COPY composer.json composer.lock ./

# Install Composer dependencies, skipping dev dependencies and optimizing for production
# --no-dev: Excludes packages only needed for development/testing.
# --optimize-autoloader: Speeds up class loading in production.
RUN composer install \
    --prefer-dist \
    --no-dev \
    --no-interaction \
    --optimize-autoloader \
    --ignore-platform-reqs

# Copy the rest of the application files (e.g., custom modules, themes)
COPY . /app

# Optional: Run any necessary build commands (e.g., front-end asset compilation)
# RUN npm install && npm run build
# The "builder" stage finishes here. The final image will not contain these tools.

# --------------------------------------------------------------------------------
# STAGE 2: PRODUCTION (The "Minimal" Stage - The final, hardened image)
# --------------------------------------------------------------------------------

# Use the minimal PHP-FPM image based on Alpine Linux 3.20 (or latest Alpine version)
# This is the actual image that will be deployed to Fargate/ECS.
FROM php:8.3-fpm-alpine3.20 as production

# Install necessary runtime dependencies using Alpine's package manager (apk)
# These are essential PHP extensions and system libraries for a standard Drupal setup.
# The list below is standard for Drupal/Symfony based applications.
RUN apk add --no-cache \
    $PHPIZE_DEPS \
    # Standard Libraries
    git \
    nginx \
    # Required PHP Extensions
    libxml2-dev \
    freetype-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    icu-dev \
    # Database Drivers (select your DB)
    postgresql-dev \
    mariadb-dev \
    # WebP/Image support
    libwebp-dev \
    \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        pdo_pgsql \
        opcache \
        gd \
        intl \
        zip \
        xml \
        mbstring \
        # Add any other required extensions here (e.g., exif, bcmath, soap) \
    \
    # Cleanup to keep the image small
    && apk del $PHPIZE_DEPS \
    && rm -rf /tmp/*

# Set the application's working directory
WORKDIR /var/www/html

# Copy the *built* application code from the 'builder' stage
# The 'production' stage starts with a clean slate, only copying what's needed.
COPY --from=builder /app /var/www/html

# Ensure FPM runs as a non-root user for security (usually 'www-data' or similar)
# Create a dedicated user/group and set permissions for security
RUN addgroup -g 82 -S www-data \
    && adduser -u 82 -D -S -G www-data www-data \
    && chown -R www-data:www-data /var/www/html \
    && mkdir -p /var/www/html/web/sites/default/files \
    && chown -R www-data:www-data /var/www/html/web/sites/default

# Expose the FPM port (default)
EXPOSE 9000

# Run the PHP-FPM executable as the main container process
# FPM configuration should be managed in a separate file (e.g., www.conf)
CMD ["php-fpm"]
