<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" indent="yes"/>

    <xsl:template match="/">
        <h1><xsl:value-of select="translations/de/heading"/></h1>
        <h2><xsl:value-of select="translations/de/subheading"/></h2>
        <p><xsl:value-of select="translations/de/content"/></p>
    </xsl:template>
</xsl:stylesheet>
