<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    
    <xsl:param name="table-border" select="'1'"/>
    <xsl:param name="table-width" select="'100%'"/>

    <xsl:template match="/">
        <html>
            <head>
                <style>
                    table {
                        width: <xsl:value-of select="$table-width"/>;
                        border-collapse: collapse;
                        
                    }
                    th, td {
                        border: <xsl:value-of select="$table-border"/>px solid black;
                        padding: 8px;
                        text-align: left;
                    }
                </style>
                
            </head>
            <body>

                <xsl:apply-templates select="/data/*"/>
            </body>
        </html>
    </xsl:template>

    <!-- Template for facts -->
    <xsl:template match="facts">

        <h2>ClimateSight Analytics</h2>
        <table>
            <tr>
                <th>Capital</th>
                <td><xsl:value-of select="capital"/></td>
            </tr>
            <tr>
                <th>Flagge</th>
                <td>
                    <img src="{flag}" alt="{altFlag}" style="width: 30%;"/><br/>
                    <xsl:value-of select="altFlag"/>
                </td>
            </tr>
            <tr>
                <th>Population</th>
                <td><xsl:value-of select="population"/></td>
            </tr>
        </table>
    </xsl:template>

    <!-- Template for current weather -->
    <xsl:template match="current">
        <h2>Aktuelles Wetter</h2>
        <table>
            <tr>
                <th>Temperatur</th>
                <td><xsl:value-of select="temperature"/>°C</td>
            </tr>
            <tr>
                <th>Luftfeuchtigkeit</th>
                <td><xsl:value-of select="humidity"/>%</td>
            </tr>
            <tr>
                <th>Beschreibung</th>
                <td><xsl:value-of select="condition[@value='de']"/></td>
            </tr>
        </table>
    </xsl:template>

  
  
    <!-- Chart template -->
    <xsl:template match="chart">
        <!-- Apply template for chart elements -->
        
    </xsl:template>
            
    <!-- Template for chart element -->
    <xsl:template match="chart">
    
        <svg width="620" height="500" xmlns="http://www.w3.org/2000/svg">
           

            <!-- Define marker for arrowheads -->
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                        refX="10" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="black" />
                </marker>
            </defs>

            <!-- Draw axes with arrowheads -->
            <line x1="50" y1="400" x2="550" y2="400" stroke="black" marker-end="url(#arrowhead)" />
            <line x1="50" y1="600" x2="50" y2="50" stroke="black" marker-end="url(#arrowhead)" />

            <!-- X-axis label -->
            <text x="308" y="495" text-anchor="middle" font-size="15" fill="black"><xsl:value-of select="@xvalue" /></text>

            <!-- Y-axis label -->
            <text x="20" y="190" text-anchor="middle" font-size="15" fill="black" transform="rotate(-90 20,200)"><xsl:value-of select="@yvalue" /></text>

            <!-- Draw the line chart for the current chart element -->
            <polyline fill="none" stroke-width="2">
                <xsl:attribute name="stroke">
                    <xsl:value-of select="@color" />
                </xsl:attribute>
                <xsl:attribute name="points">
                    <xsl:apply-templates select="values/point" mode="points" />
                </xsl:attribute>
            </polyline>

            <!-- Draw data points for the current chart element -->
            <xsl:apply-templates select="values/point" mode="circles" />

            <!-- Draw X-axis units for the current chart element -->
            <xsl:apply-templates select="values/point" mode="x-units" />

            <!-- Draw Y-axis units for the current chart element -->
            <xsl:apply-templates select="values/point" mode="y-units" />
        </svg>
    </xsl:template>

    <!-- Template for generating polyline points -->
    <xsl:template match="point" mode="points">
        <xsl:value-of select="concat(50 + @x, ',', 400 - @y, ' ')" />
    </xsl:template>

    <!-- Template for generating circles -->
    <xsl:template match="point" mode="circles">
        <circle cx="{50 + @x}" cy="{400 - @y}" r="3" fill="red" />
    </xsl:template>

    <!-- Template for generating X-axis units -->
    <xsl:template match="point" mode="x-units">
        <text x="{65 + @x}" y="420" text-anchor="middle" font-size="13" fill="black" >
            <xsl:value-of select="@tag" />
        </text>
    </xsl:template>

    <!-- Template for generating Y-axis units -->
    <xsl:template match="point" mode="y-units">
        <text x="37" y="{405 - @y}" text-anchor="end" font-size="10" fill="black">
            <xsl:value-of select="@y" />
        </text>
    </xsl:template>

      <!-- Template for historical weather -->
    <xsl:template match="historical">
        <h2>Historische Wetterdaten</h2>
        <table>
            <tr>
                <th>Jahr</th>
                <th>Durchschnittlicher Niederschlag (mm/m2)</th>
                <th>Durchschnittlichs Temperatur</th>
                <th>Durchschnittliche Schneefall (mm/m2)</th>
            </tr>
            <xsl:apply-templates select="year"/>
        </table>
    </xsl:template>

    <!-- Template for each year in historical weather -->
    <xsl:template match="year">
        <tr>
            <td><xsl:value-of select="@value"/></td>
            <td><xsl:value-of select="average_precipitation_sum"/> mm</td>
            <td><xsl:value-of select="average_temperature_2m_max"/>°C</td>
            <td><xsl:value-of select="snowfall_sum"/> cm</td>
        </tr>
    </xsl:template>
</xsl:stylesheet>
