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
  - Sätt en API-nyckel enligt instruktionerna under "Få tag i en API-nyckel" nedan, sätt sedan denna nyckel i egenskapen 'key' i constant('API')
  - Ändra vid behov adressen till servern i egenskapen 'baseUrl' i constant('API'), t.ex om servern körs på en annan port.
- Tryck fram app/index.html, och gör en "Preview" i en webbläsare (i Windows tryck Alt+F2).
- Startsidan bör nu visas och du kan navigera runt i webbapplikationen (observera att det inte går göra en refresh (F5) i annat än på root url:en (Client/app/), samt på startsidan (/map) då jag lagt en kopia på index.html här för testnings skull).

### Få tag i en API-nyckel
- Logga in på servern (http://localhost:3000 vanligtvis) med ett administratörs-inlogg: admin@test.com, lösenord: admin
- Kopiera en API-nyckel från någon av användarna.

### Inloggningsuppgifter på klienten
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
	- Följ instruktionerna under "Få tag i en API-nyckel".
	- I Postman klicka på Webbramverk uppe i högra hörnet -> "Manage environments" -> "Webbramverk".
	- Rensa fältet "ApiKey" och klistra sedan in den du kopierade.
- Nu kan du köra de sparade metoder som finns i "Main"-mappen och se att allt fungerar.
	

## Ändringar som gjordes på API-delen under byggandet av klienten

### Update och save-funktionerna i EventsController:
- Fick bättre returnering vid fel, t.ex validering som inte går igenom. Detta för att klienten lättare ska kunna visa vad exakt som gick fel (vilken egenskap t.ex).
- Gjorde så update och save använder samma funktion med bara små skillnader (DRY).
- La till transaktions-hantering, så att om någon del misslyckas (t.ex sparande av taggar) så sparas inget (inte heller eventet). Fick i.o.m. detta även skapa en egen error-klass för att särskilja fel med sparande av tagg från sparande av själva eventet.

###Location-validering
- La till validering på 'name' i Location-modellen i Rails för att få ett bra felmeddelande till klienten vid sparande av event.

###Fler parametrar
- Fick lägga till id-fält för några modeller vid GET-anrop mot API:et, för att sparande ska kunna vara möjligt (t.ex i location_attributes vid sparande av event, id i creator-modellen och några fler).

###CreatorsController current-funktion
- La till en funktion för att hämta ut nuvarande inloggade creator, för att kunna använda i klienten.






