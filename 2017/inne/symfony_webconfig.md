Poniżej załączam konfigurację pliku web.config działającego pod IIS dla środowiska Symfony.
Aby używać Symfony pod IIS w konfiguracji DEV z działającym profilerem zmień app.php na app_dev.php w poniższej konfiguracji.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <defaultDocument>
            <!-- dokumenty domyślne w tym app.php -->
        </defaultDocument>
        <rewrite>
		<rules>
               	<clear />
               	
               	<!-- Rule dla plików statycznych jak CSS/JS -->
               	<rule name="StaticFiles" stopProcessing="true">
                    <match url="^(.*)$" />
                    <conditions logicalGrouping="MatchAll" trackAllCaptures="false">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile"/>
                    </conditions>
                    <action type="Rewrite" url="{R:0}" logRewrittenUrl="true" />
                </rule>
               	
               	
               	<rule name="Symfony 1" stopProcessing="true">
                    <match url="^app\.php(/(.*)|$)" ignoreCase="false" />
                    <conditions logicalGrouping="MatchAll" trackAllCaptures="false" />
                    <action type="Redirect" url="/{R:2}" redirectType="Permanent" />
               	</rule>
               	<rule name="Symfony 2" stopProcessing="true">
                    <match url=".?" ignoreCase="false" />
                    <conditions logicalGrouping="MatchAll" trackAllCaptures="false">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" ignoreCase="false" />
                    </conditions>
                    <action type="None" />
               	</rule>
               	<rule name="Symfony 3" enabled="true" stopProcessing="true">
                    <match url=".?" ignoreCase="false" />
                    <conditions logicalGrouping="MatchAll" trackAllCaptures="false" />
                    <action type="Rewrite" url="/app.php" />
               	</rule>
		</rules>
	</rewrite>
    </system.webServer>
</configuration>
```
