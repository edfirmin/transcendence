FROM debian:buster

RUN apt update && apt install -y nginx

RUN mkdir -p /etc/nginx/ssl/

COPY ./ssl/* /etc/nginx/ssl/
COPY ./conf/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]