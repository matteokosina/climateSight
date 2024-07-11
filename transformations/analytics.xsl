<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    
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
        <h2>ClimateSight Analytics: <xsl:value-of select="capital"/></h2>
        <table>
            <tr>
                <th>Capital</th>
                <td><xsl:value-of select="capital"/></td>
            </tr>
            <tr>
                <th>Flag</th>
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
        <h2>Current Weather</h2>
        <table>
            <tr>
                <th>Temperature</th>
                <td><xsl:value-of select="temperature"/>°C</td>
            </tr>
            <tr>
                <th>Humidity</th>
                <td><xsl:value-of select="humidity"/>%</td>
            </tr>
            <tr>
                <th>Condition (EN)</th>
                <td><xsl:value-of select="condition[@value='en']"/></td>
            </tr>
            <tr>
                <th>Condition (DE)</th>
                <td><xsl:value-of select="condition[@value='de']"/></td>
            </tr>
        </table>
    </xsl:template>

    <!-- Template for historical weather -->
    <xsl:template match="historical">
        <h2>Historical Weather Data</h2>
        <table>
            <tr>
                <th>Year</th>
                <th>Avg Precipitation Sum</th>
                <th>Avg Temperature Max</th>
                <th>Snowfall Sum</th>
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
