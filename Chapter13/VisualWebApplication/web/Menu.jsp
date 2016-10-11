<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.1" xmlns:f="http://java.sun.com/jsf/core" xmlns:h="http://java.sun.com/jsf/html" xmlns:jsp="http://java.sun.com/JSP/Page" xmlns:webuijsf="http://www.sun.com/webui/webuijsf">
    <jsp:directive.page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"/>
    <f:view>
        <webuijsf:page binding="#{Menu.page1}" id="page1">
            <webuijsf:html binding="#{Menu.html1}" id="html1">
                <webuijsf:head binding="#{Menu.head1}" id="head1">
                    <webuijsf:link binding="#{Menu.link1}" id="link1" url="/resources/stylesheet.css"/>
                </webuijsf:head>
                <webuijsf:body binding="#{Menu.body1}" id="body1" style="-rave-layout: grid">
                    <webuijsf:form binding="#{Menu.form1}" id="form1">
                        <webuijsf:hyperlink actionExpression="#{Menu.lnkSiteMap_action}" binding="#{Menu.lnkSiteMap}" id="lnkSiteMap"
                            style="position: absolute; left: 24px; top: 96px" text="Site Map"/>
                        <webuijsf:button actionExpression="#{Menu.btnProducts_action}" binding="#{Menu.btnProducts}" id="btnProducts"
                            style="position: absolute; left: 24px; top: 48px" text="Products"/>
                        <webuijsf:button actionExpression="#{Menu.btnServices_action}" binding="#{Menu.btnServices}" id="btnServices"
                            style="position: absolute; left: 144px; top: 48px" text="Services"/>
                        <webuijsf:button actionExpression="#{Menu.btnAboutUs_action}" binding="#{Menu.btnAboutUs}" id="btnAboutUs"
                            style="position: absolute; left: 264px; top: 48px" text="About Us"/>
                    </webuijsf:form>
                </webuijsf:body>
            </webuijsf:html>
        </webuijsf:page>
    </f:view>
</jsp:root>
