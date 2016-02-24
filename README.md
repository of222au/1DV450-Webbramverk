# API-registrering, Ruby on Rails-applikation i kursen Webbramverk
Linnéuniversitet VT16

Av: Ola Franzén (of222au)

## För att köra igång servern
- Kör "vagrant up"
- Kör "vagrant ssh"
- Navigera till applikationen genom "cd /vagrant/WebAPI"
- Installera bundles genom: "bundle install"
- Installera databasen och seeda den genom "rake db:drop db:reset"
- Starta servern genom "rails s -b 0.0.0.0"
- Webbapplikationen kan nu kommas åt via http://localhost:3000

## För att använda Postman-filen:
- Läs in postman-filen (som slutar på .postman_collection) i Postman genom "Import".
- En mapp "Webbramverk API" har nu lagts till med olika metoder.
- Sätt rätt Auth token:
	- Klicka på mappen "Pre" och sedan på "auth" och Send.
	- Kopiera den "auth_token" som fås i responsen.
	- Klicka på Webbramverk uppe i högra hörnet -> "Manage environments" -> "Webbramverk".
	- Rensa fältet "AuthToken" och klistra sedan in den du fick i responsen tidigare.
- Sätt rätt API key:
	- Använd SQLite Browser (http://sqlitebrowser.org/) eller någon annat program för att kolla i en sqlite3-databas.
	- Öppna filen db/development.sqlite3
	- Gå till fliken "Browse Data" och välj tabellen "user_applications". 
	- Kopiera en av "api_key"-nycklarna (kvittar vilken).
	- Gå tillbaka till Postman och klicka på Webbramverk uppe i högra hörnet -> "Manage environments" -> "Webbramverk".
	- Rensa fältet "ApiKey" och klistra sedan in den du kopierade.
- Nu kan du köra de sparade metoder som finns i "Main"-mappen och se att allt fungerar.
	

