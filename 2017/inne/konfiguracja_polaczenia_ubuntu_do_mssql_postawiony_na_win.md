Jak połączyć się z aplikacji PHP v.7 postawionej lokalnie na ubuntu 16.4 + apache2 
do MSSQLa zainstalowanego na windows serverze 

Jeśli nie masz php7 + apache to:

```bash
sudo apt-get -y install php7.0 libapache2-mod-php7.0 mcrypt php7.0-mcrypt php-mbstring php-pear php7.0-dev apache2
```

Instalacja SQLCMD

```bash
sudo su
curl https://packages.microsoft.com/config/ubuntu/16.04/prod.list > /etc/apt/sources.list.d/mssql-tools.list
exit
sudo apt-get update
sudo ACCEPT_EULA=Y apt-get install mssql-tools
sudo apt-get install unixodbc-dev
echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bash_profile
echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc
source ~/.bashrc
```

Sprawdz czy działa:

```bash
sqlcmd -S localhost -U sa -P yourpassword -Q "SELECT @@VERSION"
```

Instalacja DRIVERÓW

```bash
sudo su
curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
curl https://packages.microsoft.com/config/ubuntu/16.04/prod.list > /etc/apt/sources.list.d/mssql-release.list
exit
sudo apt-get update
sudo ACCEPT_EULA=Y apt-get install msodbcsql
sudo apt-get install unixodbc-dev gcc g++ build-essential
sudo pecl install sqlsrv pdo_sqlsrv
sudo echo "extension= pdo_sqlsrv.so" >> `php --ini | grep "Loaded Configuration" | sed -e "s|.*:\s*||"`
sudo echo "extension= sqlsrv.so" >> `php --ini | grep "Loaded Configuration" | sed -e "s|.*:\s*||"`
```
 LUB zamiast (sudo pecl install sqlsrv pdo_sqlsrv)

mozna na stronie MS na githubie znaleźć (https://github.com/Microsoft/msphpsql/releases)

```bash
sudo pecl install sqlsrv-4.1.7preview
sudo pecl install pdo_sqlsrv-4.1.7preview

```

Dodajemy do php.ini (dla apache i cli)


założenie bazy danych

```bash
sqlcmd -S localhost -U sa -P your_password -Q "CREATE DATABASE SampleDB;"

```

Konfiguracja pod Symfony !?

