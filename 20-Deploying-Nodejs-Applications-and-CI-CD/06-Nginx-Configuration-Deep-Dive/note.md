'sudo nginx -t': test if the config is valid
'sudo nginx -s': stop: stop the server
'sudo nginx': start the server
'sudo nginx -s reload': restart server from the newly updated config
'nginx --help': available nginx flags

'/var/www/html/index.nginx-debian.html': serves this at home page, from the config

'/usr/share/nginx/html/index.html' : serves this when no html is set in configuration

is a valid config syntax(but not complete so will throw error):

```
events {}
```

is valid and doesn't throws error, nginx will use defaults in this case(but http://localhost:80 will not serve any html):

```
events {}
http{}
```

now it serves the html on http://localhost:80, from /usr/share/nginx/html/index.html

```
events{}
http{
    server{}
}
```

serves index.html from the give root dir at home page
```
events {}

http {
	server {
		root /var/www/html;
	 }
}
```

serves the custom html from the give root dir at home page
```
events {}

http {
	server {
		root /var/www/html;
        index index.nginx-debian.html;
	 }
}
```

by default at least 1 worker for that master process exists(see it in CGroup below):
```
raquib@Raquib-desktop:~$ ps aux | grep [n]ginx
root       10228  0.0  0.0  11068  1636 ?        Ss   18:51   0:00 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
nobody     10229  0.0  0.1  12652  4004 ?        S    18:51   0:00 nginx: worker process
```

but can be customised by 
```
worker_processes 4;

events {}

http {
	server {
		root /var/www/html;
		index index.nginx-debian.html;
	 }
}
```

'auto' sets the count by the logical cores available in our system
```
worker_processes auto;
```

is it max no of file descriptors per process?
```
events {
    worker_connections 1000
}
```

- killing the worker processes only, if the master process exist then new worker processes will be created
- the master process runs as root user but worker processes dont, they run as nobody
```
raquib@Raquib-desktop:~$ ps aux  | grep [n]ginx
root       17510  0.0  0.0  11068  1696 ?        Ss   22:57   0:00 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
nobody     17511  0.0  0.1  12652  4072 ?        S    22:57   0:00 nginx: worker process
nobody     17512  0.0  0.1  12652  4072 ?        S    22:57   0:00 nginx: worker process
nobody     17513  0.0  0.1  12652  4072 ?        S    22:57   0:00 nginx: worker process
nobody     17514  0.0  0.1  12652  4008 ?        S    22:57   0:00 nginx: worker process
```

worker processes will now run as raquib user, www-data user will be created but not like it will have it's own home dir
```
worker_processes auto;
# user raquib
user www-data
```

now every file is rendered as plain text, so we have to define the content type
```
http {
	server {
		types { 
			text/html
			text/css css;
			text/javascript js;
			image/webp webp;
		}
		root /var/www/simple-website;
	 }
}
```
- if we dont give types, html will be rendered but other files will be served as plain text, but on setting types except for html, it will render html as plain-text

manually giving types is a headache, nginx provides a file mime.types for this purpose
```
http {
	include mime.types  # or /etc/nginx/mime/types
	server {
		root /var/www/simple-website;
	 }
}
```
