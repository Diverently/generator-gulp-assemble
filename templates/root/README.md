# <%= sitename %>
*Projektbeschreibung*

## Build & Development
Sollte in diesem Projekt weitergearbeitet werden, müssen dafür `node` und `gulp` installiert sein (weitere Informationen unter: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md).

Ist das der Fall, muss im Arbeitsverzeichnis lediglich `gulp` ausgeführt werden. Es werden dann im `.tmp` Ordner die Dateien angelegt, die für BrowserSync genutzt werden.

Mit `gulp build` wird der `dist` Ordner aktualisiert.

## Assemble & Verzeichnisstruktur
Dies ist ein klassisches [Assemble](http://assemble.io) Projekt. Der `src` Ordner ist folgendermaßen aufgebaut:

```
assets/
| css/
  | core/
  | modules/
  | vendor/
  | main.scss
| img/
| js/
  | standalone/
  | vendor/
  | main.js
data/
layouts/
pages/
partials/
```

Im `data` Ordner ist ein Teil der Daten hinterlegt, die später aus der Datenbank kommen, um die Templates so aufgeräumt wie möglich zu halten.

Im `partials` Ordner sind einige Teile des Markups hinterlegt, um übersichtlicher mit ihnen arbeiten zu können.

## Assets
Das CSS wird standardmäßig mit Sass geschrieben. In der `main.scss` werden alle Dateien importiert. Third Party Styles sind im `vendor` Ordner.

Das JavaScript wird in der `main.js` geschrieben. Sie wird durch Gulp mit den anderen Scripts zusammengefasst. Dateien im `standalone` Ordner werden einfach kopiert.

### Sprites
Der Ordner `img/sprite-svg` enthält alle SVGs die von Gulp in Sprites umgewandelt werden.

```
gulp sprites
```

Mit diesem Befehl (im Root Ordner) werden aus den SVGs im Ordner `img/sprite-svg` ein SVG-Sprite und ein PNG-Sprite generiert. Im selben Ordner befindet sich die Datei `template.scss`, mit dessen Hilfe die `_sprite.scss` Datei im Ordner `css/core` generiert wird und die einige Hilfsfunktionen für die Sprites bereitstellt.
