# Ruby on Rails-applikation med AngularJS-frontend i kursen Webbramverk
Linnéuniversitet VT16

Av: Ola Franzén (of222au)

## För att köra igång servern
- Klona/ladda ner repositoriet. 
- Kör "vagrant up" (i den yttre mappen).
- Kör "vagrant ssh"
- Navigera till applikationen genom "cd /vagrant/WebAPI"
- Installera bundles genom: "bundle install"
- Installera databasen och seeda den genom "rake db:drop db:reset"
- Starta servern genom "rails s -b 0.0.0.0"
- Webbapplikationen kan nu kommas åt via http://localhost:3000

## För att köra igång klienten
- Använd t.ex JetBrains WebStorm och ladda in Client-mappen.
- Editera filen app/app.js:
  - Sätt en API-nyckel (se instruktioner hur detta kan läsas ut ur databasen i stegen om Postman nedan), sätt sedan nyckeln i egenskapen 'key' i constant('API')
- Tryck fram app/index.html, och gör en "Preview" i en webbläsare (i Windows tryck Alt+F2).
- Startsidan bör nu visas och du kan navigera runt i webbapplikationen (observera att det inte går göra en refresh (F5) i annat än på root url:en (Client/app/), samt på startsidan (/map) då jag lagt en kopia på index.html här för testnings skull).


##Inloggningsuppgifter
- Två "creators" skapas automatiskt genom seedning som man kan logga in med för testning:
 - user1@test.com / lösenord: 1234
 - user2@test.com / lösenord: 1234

### För att använda Postman-filen:
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
	

## Ändringar som gjordes på API-delen under byggandet av klienten

###Update och save-funktionerna i EventsController:
- Fick bättre returnering vid fel, t.ex validering som inte går igenom. Detta för att klienten lättare ska kunna visa vad exakt som gick fel (vilken egenskap t.ex).
- Gjorde så update och save använder samma funktion med bara små skillnader (DRY).
- La till transaktions-hantering, så att om någon del misslyckas (t.ex sparande av taggar) så sparas inget (inte heller eventet). Fick i.o.m. detta även skapa en egen error-klass för att särskilja fel med sparande av tagg från sparande av själva eventet.

###Location-validering
- La till validering på 'name' i Location-modellen i Rails för att få ett bra felmeddelande till klienten vid sparande av event.

###Fler parametrar
- Fick lägga till id-fält för några modeller vid GET-anrop mot API:et, för att sparande ska kunna vara möjligt (t.ex i location_attributes vid sparande av event, id i creator-modellen och några fler).

###CreatorsController current-funktion
- La till en funktion för att hämta ut nuvarande inloggade creator, för att kunna använda i klienten.






