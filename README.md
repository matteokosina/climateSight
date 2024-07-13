

<img width="185" style="float:'left'" alt="Bildschirmfoto 2024-05-16 um 11 59 34" src="https://github.com/matteokosina/climateSight/assets/74454734/0bf52718-804c-4865-aff9-3f83d52e87e6">

# ClimateSight

> Beschreibung des Projektes
>
> Eine Live-Demo der Website findet sich [hier](https://matteokosina.github.io/climateSight/) .
>
> -> ausgelegt für desktop user
>
> -> ClimateSight kann auch selbst lokal betrieben werden, eine [Installationsanleitung](#installation) findet sich unterhalb.



|      ![Demo Bild](./demo.png)      |
| :--------------------------------: |
| ClimateSight Startseite |

## Umsetzung
Folgende Technologien und Tools wurden für das Projekt aus folgenden Gründen
angewandt.

### XML

-> Beschreibung, was alles wie in XML gelöst wurde ( + .dtd)

### XSLT

-> Beschreubung, wie XSLT genutzt wurde

### Karte

Mit der Javascript Bibliothek `Leaflet` (siehe [hier](https://leafletjs.com/))
wird die Karte generiert.
-> Beschreubung, wie Karten genutzt wurden


### Daten

-> Datenquellen und APIs (evt. Rate-Limit erwähnen)


### Struktur

> muss am Ende noch aktualisiert werden

Projektaufbau:

```
climatesight/
├── data-orchestration/
│   └── orchestrator.js/            : managed allen Datenbeschaffungen und führt sie in einer XML zusammen
│   └── facts.js/
│   └── currentWeather.js/
│   └── historicalWeather.js/
│   └── analytics.html/
└── map/                : enthält alle wichtigen Dateien für die Kartenanwendung
│   └── dsicover.html/
│   └── render.js/
└── static/   
│   └── data/
│       └── zones.xml/                : enthält die Koordinaten der Klimazonen, die später in KML-Format transformiert werden
└── resources/                : enthält alle wichtigen Dateien für die Kartenanwendung
│   └── leaflet.css/                : Resourcen für die Nutzung der Kartenbibliothek
│   └── leaflet.js/
└── styles/
│   └── style.css/                : zentrales Stylesheet
└── transformations/
│   └── analytics.xsl/                : transformiert die Daten für die Discover-Seite (Kartenanwendung)
│   └── discover.xsl/                : transformiert die Daten für die Analytics-Seite 
    
```

## Features

Folgende Features umfasst die App
+ Feature 1
+ Feature 2
## Installation

-> Erklärung wie der webserver gestartet wird

## Contributor

 <table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/F2011"><img src="https://avatars.githubusercontent.com/u/110890521?v=4" width="100px;" alt="Leon Fertig"/><br /><sub><b>Leon Fertig</b></sub></a><br /> </td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/matteokosina"><img src="https://avatars.githubusercontent.com/u/74454734?v=4" width="100px;" alt="Matteo Kosina"/><br /><sub><b>Matteo Kosina</b></sub></a><br /></td>
   
  </tbody>
</table>


