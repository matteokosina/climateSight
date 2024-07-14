<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    
    <xsl:output method="html" indent="yes" />
    
    <xsl:template match="/translations/de">
                <link rel="stylesheet" type="text/css" href="../styles/style.css"/>

                <nav>
                    <div class="nav-wrapper">
                    <a href="{navbar/logo/@ref}">
                        <img id="logo" src="{navbar/logo/@src}" alt="{navbar/logo/@alt}" />
                        <div class="company-name"><xsl:value-of select="navbar/logo/@name"/></div>
                    </a>
                    <ul id="nav-mobile" class="right hide-on-med-and-down">
                        <li><a href="{navbar/link/@ref}"><xsl:value-of select="navbar/link"/></a></li>
                    </ul>
                    </div>
                </nav>   
                
                <div id="info">
                    <h1> <xsl:value-of select="heading"/></h1>
                    <h2> <xsl:value-of select="subheading"/></h2>
                    <xsl:value-of select="text"/>
                </div>
                <div id="showZones"><a href="#" ><xsl:value-of select="launch"/></a></div>
                <div id="map" style="height: 90%; width:75%; position:absolute; z-index:0;"></div>
                <footer>
                    <a href="{footer/logo/@ref}">
                        <img id="footer-logo" src="{footer/logo/@src}" alt="{footer/logo/@alt}" />
                        <span><xsl:value-of select="footer/logo/@name"/></span>
                    </a>
                    <p>
                        <xsl:value-of select="footer/copyright/text()[1]"/>
                        <a href="{footer/copyright/imprint/@ref}">
                            <xsl:value-of select="footer/copyright/imprint"/>
                        </a>
                        <xsl:value-of select="footer/copyright/text()[2]"/>
                    </p>
                </footer>
            
    </xsl:template>

</xsl:stylesheet>
