# Dockerfile for Laravel + Vite (React)
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev npm

# Install PHP extensions required by Laravel
RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy project files
COPY . .

# Install PHP dependencies
RUN composer install --optimize-autoloader --no-dev

# Install Node dependencies and build assets
RUN npm install && npm run build

# Set permissions
RUN chown -R www-data:www-data /var/www
RUN chmod -R 775 storage bootstrap/cache

# Run Laravel config cache and migrations to surface errors
RUN php artisan config:cache
RUN php artisan migrate --force || true

# Expose port 8000
EXPOSE 8000

# Start PHP built-in server for Laravel public directory using Render's dynamic $PORT
CMD php -S 0.0.0.0:$PORT -t public
