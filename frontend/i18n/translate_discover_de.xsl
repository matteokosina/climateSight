<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" indent="yes"/>

    <xsl:template match="/">
        <h1><xsl:value-of select="translations/de/heading"/></h1>
        <h2><xsl:value-of select="translations/de/subheading"/></h2>
        <div class="divider"><xsl:value-of select="translations/de/content/Divider"/></div>
        <p><xsl:value-of select="translations/de/content/Info"/></p>
        <a href="javascript:mockFilter('green')" class="filter green"><xsl:value-of select="translations/de/content/Filter0"/></a>
        <a href="javascript:mockFilter('blue')" class="filter blue"><xsl:value-of select="translations/de/content/Filter1"/></a>
        <a href="javascript:mockFilter('red')" class="filter red"><xsl:value-of select="translations/de/content/Filter2"/></a>

    </xsl:template>
</xsl:stylesheet>
