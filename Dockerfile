# --- STAGE 1: Composer install ---
FROM php:8.3-cli-alpine3.20 AS composer

ENV COMPOSER_ALLOW_SUPERUSER=1

# System dependencies for Composer (including freetype-dev and postgresql-dev for platform requirements check)
RUN apk add --no-cache git unzip icu-dev libzip-dev libpng-dev libjpeg-turbo-dev \
    libwebp-dev freetype-dev libxml2-dev oniguruma-dev curl-dev zlib-dev postgresql-dev

# Match prod ext set so composer platform checks succeed
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
 && docker-php-ext-install -j$(nproc) gd intl zip xml mbstring curl bcmath exif pdo_mysql pdo_pgsql

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Leverage Docker cache: only copy composer files first
COPY composer.json composer.lock ./
# We may need these eventutally
# COPY patches/ patches/
# COPY web/libraries/ web/libraries/

# Install prod dependencies with scripts enabled so scaffold runs
RUN --mount=type=cache,target=/root/.composer/cache \
    composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction --no-ansi

# --- STAGE 2: PHP-FPM production image ---
FROM php:8.3-fpm-alpine3.20 AS production

WORKDIR /var/www/html

ENV PHP_MEMORY_LIMIT=512M \
    PHP_UPLOAD_MAX_FILESIZE=100M \
    PHP_POST_MAX_SIZE=100M \
    PHPIZE_DEPS="autoconf file g++ gcc libc-dev make pcre-dev"

# System deps
RUN apk add --no-cache $PHPIZE_DEPS git icu-dev libzip-dev libpng-dev libjpeg-turbo-dev \
    libwebp-dev freetype-dev libxml2-dev oniguruma-dev curl-dev zlib-dev libffi-dev libedit-dev fcgi postgresql-dev \
    # optional image toolkit (if you switch to imagick): imagemagemagick-dev
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql pdo_pgsql opcache gd intl zip xml mbstring curl bcmath exif \
    && pecl install apcu redis \
    && docker-php-ext-enable apcu redis \
    && apk del $PHPIZE_DEPS \
    && rm -rf /tmp/* /var/cache/apk/*

# Copy vendor from build stage first, setting ownership here to skip slow chown -R later.
COPY --from=composer --chown=www-data:www-data /var/www/html/vendor /var/www/html/vendor
# Copy the rest of the app last
COPY --chown=www-data:www-data . /var/www/html

# Opcache & PHP production settings
RUN { \
      echo "opcache.enable=1"; \
      echo "opcache.validate_timestamps=0"; \
      echo "opcache.interned_strings_buffer=16"; \
      echo "opcache.max_accelerated_files=20000"; \
      echo "opcache.memory_consumption=256"; \
      echo "opcache.save_comments=1"; \
      echo "memory_limit=${PHP_MEMORY_LIMIT}"; \
      echo "post_max_size=${PHP_POST_MAX_SIZE}"; \
      echo "upload_max_filesize=${PHP_UPLOAD_MAX_FILESIZE}"; \
    } > /usr/local/etc/php/conf.d/docker-php-prod.ini

# FPM tweaks: one pool file example (optional)
RUN { \
      echo "[www]"; \
      echo "pm=dynamic"; \
      echo "pm.max_children=20"; \
      echo "pm.start_servers=4"; \
      echo "pm.min_spare_servers=2"; \
      echo "pm.max_spare_servers=8"; \
      echo "clear_env=no"; \
      echo "catch_workers_output=yes"; \
    } > /usr/local/etc/php-fpm.d/www.conf

# Create runtime-writable dirs
RUN mkdir -p /var/www/html/web/sites/default/files \
             /var/www/html/private
# Switch to the non-root user
USER www-data

EXPOSE 9000

CMD ["php-fpm", "-F"]
