FROM ubuntu:22.04
ARG DEBIAN_FRONTEND=noninteractive

WORKDIR /usr/src

RUN apt update -y 
RUN apt upgrade -y 
RUN apt -y install software-properties-common curl apt-transport-https ca-certificates gnupg mariadb-server nginx tar unzip git
RUN LC_ALL=C.UTF-8 add-apt-repository -y ppa:ondrej/php 
RUN curl -fsSL https://packages.redis.io/gpg | gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg 
RUN echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/redis.list 
RUN apt update -y 
RUN apt -y install redis-server 
RUN apt -y install php8.1 php8.1-{common,cli,gd,mysql,mbstring,bcmath,xml,fpm,curl,zip}
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN mkdir -p /var/www/pterodactyl

WORKDIR /var/www/pterodactyl

RUN curl -Lo panel.tar.gz https://github.com/pterodactyl/panel/releases/latest/download/panel.tar.gz
RUN tar -xzvf panel.tar.gz
RUN chmod -R 755 storage/* bootstrap/cache/
RUN mysql -u root -p
RUN CREATE USER 'pterodactyl'@'127.0.0.1' IDENTIFIED BY 'yourPassword';
RUN CREATE DATABASE panel;
RUN GRANT ALL PRIVILEGES ON panel.* TO 'pterodactyl'@'127.0.0.1' WITH GRANT OPTION;
RUN exit
RUN cp .env.example .env
RUN composer install --no-dev --optimize-autoloader
RUN php artisan key:generate --force 
RUN php artisan migrate --seed --force