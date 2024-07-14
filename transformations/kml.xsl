<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:kml="http://www.opengis.net/kml/2.2">

  <xsl:strip-space elements="*"/>

  <xsl:template match="/">
    <kml:kml>
      <kml:Document>
        <xsl:apply-templates select="geodata/zone"/>
      </kml:Document>
    </kml:kml>
  </xsl:template>

  <xsl:template match="zone">
    <kml:Placemark>
      <kml:name>
        <xsl:value-of select="@name"/>
      </kml:name>
      <kml:Polygon>
        <kml:outerBoundaryIs>
          <kml:LinearRing>
            <kml:coordinates>
              <xsl:apply-templates select="coordinates"/>
            </kml:coordinates>
          </kml:LinearRing>
        </kml:outerBoundaryIs>
      </kml:Polygon>
    </kml:Placemark>
  </xsl:template>

  <xsl:template match="coordinates">
    <xsl:value-of select="concat(@longitude, ',', @latitude, ' ')"/>
  </xsl:template>

</xsl:stylesheet>
