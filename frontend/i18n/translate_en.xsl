<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" indent="yes"/>

    <xsl:template match="/">
        <h1><xsl:value-of select="translations/en/heading"/></h1>
        <h2><xsl:value-of select="translations/en/subheading"/></h2>
        <p><xsl:value-of select="translations/en/content"/></p>
        <a class="launch"><xsl:value-of select="translations/en/launch"/></a>
    </xsl:template>
</xsl:stylesheet>
