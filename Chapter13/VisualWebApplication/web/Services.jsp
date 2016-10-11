<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.1" xmlns:f="http://java.sun.com/jsf/core" xmlns:h="http://java.sun.com/jsf/html" xmlns:jsp="http://java.sun.com/JSP/Page" xmlns:webuijsf="http://www.sun.com/webui/webuijsf">
    <jsp:directive.page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"/>
    <f:view>
        <webuijsf:page binding="#{Services.page1}" id="page1">
            <webuijsf:html binding="#{Services.html1}" id="html1">
                <webuijsf:head binding="#{Services.head1}" id="head1">
                    <webuijsf:link binding="#{Services.link1}" id="link1" url="/resources/stylesheet.css"/>
                </webuijsf:head>
                <webuijsf:body binding="#{Services.body1}" id="body1" style="-rave-layout: grid">
                    <webuijsf:form binding="#{Services.form1}" id="form1">
                        <webuijsf:staticText binding="#{Services.staticText1}" id="staticText1" style="position: absolute; left: 120px; top: 48px"/>
                        <webuijsf:staticText binding="#{Services.staticText2}" id="staticText2" style="position: absolute; left: 264px; top: 48px"/>
                        <webuijsf:staticText binding="#{Services.staticText3}" id="staticText3" style="position: absolute; left: 432px; top: 48px"/>
                        <webuijsf:staticText binding="#{Services.staticText4}" id="staticText4" style="position: absolute; left: 120px; top: 120px"/>
                        <webuijsf:staticText binding="#{Services.staticText5}" id="staticText5" style="position: absolute; left: 264px; top: 120px"/>
                        <webuijsf:staticText binding="#{Services.staticText6}" id="staticText6" style="position: absolute; left: 432px; top: 120px"/>
                        <webuijsf:table augmentTitle="false" binding="#{Services.table1}" id="table1"
                            style="left: 72px; top: 192px; position: absolute; width: 1440px" title="Table" width="1440">
                            <webuijsf:tableRowGroup binding="#{Services.tableRowGroup1}" id="tableRowGroup1" rows="10"
                                sourceData="#{Services.customerDataProvider}" sourceVar="currentRow">
                                <webuijsf:tableColumn binding="#{Services.tableColumn1}" headerText="CUSTOMER_ID" id="tableColumn1" sort="CUSTOMER.CUSTOMER_ID">
                                    <webuijsf:staticText binding="#{Services.staticText7}" id="staticText7" text="#{currentRow.value['CUSTOMER.CUSTOMER_ID']}"/>
                                </webuijsf:tableColumn>
                                <webuijsf:tableColumn binding="#{Services.tableColumn2}" headerText="DISCOUNT_CODE" id="tableColumn2" sort="CUSTOMER.DISCOUNT_CODE">
                                    <webuijsf:staticText binding="#{Services.staticText8}" id="staticText8" text="#{currentRow.value['CUSTOMER.DISCOUNT_CODE']}"/>
                                </webuijsf:tableColumn>
                                <webuijsf:tableColumn binding="#{Services.tableColumn3}" headerText="ZIP" id="tableColumn3" sort="CUSTOMER.ZIP">
                                    <webuijsf:staticText binding="#{Services.staticText9}" id="staticText9" text="#{currentRow.value['CUSTOMER.ZIP']}"/>
                                </webuijsf:tableColumn>
                                <webuijsf:tableColumn binding="#{Services.tableColumn4}" headerText="NAME" id="tableColumn4" sort="CUSTOMER.NAME">
                                    <webuijsf:staticText binding="#{Services.staticText10}" id="staticText10" text="#{currentRow.value['CUSTOMER.NAME']}"/>
                                </webuijsf:tableColumn>
                                <webuijsf:tableColumn binding="#{Services.tableColumn5}" headerText="ADDRESSLINE1" id="tableColumn5" sort="CUSTOMER.ADDRESSLINE1">
                                    <webuijsf:staticText binding="#{Services.staticText11}" id="staticText11" text="#{currentRow.value['CUSTOMER.ADDRESSLINE1']}"/>
                                </webuijsf:tableColumn>
                                <webuijsf:tableColumn binding="#{Services.tableColumn6}" headerText="ADDRESSLINE2" id="tableColumn6" sort="CUSTOMER.ADDRESSLINE2">
                                    <webuijsf:staticText binding="#{Services.staticText12}" id="staticText12" text="#{currentRow.value['CUSTOMER.ADDRESSLINE2']}"/>
                                </webuijsf:tableColumn>
                                <webuijsf:tableColumn binding="#{Services.tableColumn7}" headerText="CITY" id="tableColumn7" sort="CUSTOMER.CITY">
                                    <webuijsf:staticText binding="#{Services.staticText13}" id="staticText13" text="#{currentRow.value['CUSTOMER.CITY']}"/>
                                </webuijsf:tableColumn>
                                <webuijsf:tableColumn binding="#{Services.tableColumn8}" headerText="STATE" id="tableColumn8" sort="CUSTOMER.STATE">
                                    <webuijsf:staticText binding="#{Services.staticText14}" id="staticText14" text="#{currentRow.value['CUSTOMER.STATE']}"/>
                                </webuijsf:tableColumn>
                                <webuijsf:tableColumn binding="#{Services.tableColumn9}" headerText="PHONE" id="tableColumn9" sort="CUSTOMER.PHONE">
                                    <webuijsf:staticText binding="#{Services.staticText15}" id="staticText15" text="#{currentRow.value['CUSTOMER.PHONE']}"/>
                                </webuijsf:tableColumn>
                                <webuijsf:tableColumn binding="#{Services.tableColumn10}" headerText="FAX" id="tableColumn10" sort="CUSTOMER.FAX">
                                    <webuijsf:staticText binding="#{Services.staticText16}" id="staticText16" text="#{currentRow.value['CUSTOMER.FAX']}"/>
                                </webuijsf:tableColumn>
                                <webuijsf:tableColumn binding="#{Services.tableColumn11}" headerText="EMAIL" id="tableColumn11" sort="CUSTOMER.EMAIL">
                                    <webuijsf:staticText binding="#{Services.staticText17}" id="staticText17" text="#{currentRow.value['CUSTOMER.EMAIL']}"/>
                                </webuijsf:tableColumn>
                                <webuijsf:tableColumn binding="#{Services.tableColumn12}" headerText="CREDIT_LIMIT" id="tableColumn12" sort="CUSTOMER.CREDIT_LIMIT">
                                    <webuijsf:staticText binding="#{Services.staticText18}" id="staticText18" text="#{currentRow.value['CUSTOMER.CREDIT_LIMIT']}"/>
                                </webuijsf:tableColumn>
                            </webuijsf:tableRowGroup>
                        </webuijsf:table>
                    </webuijsf:form>
                </webuijsf:body>
            </webuijsf:html>
        </webuijsf:page>
    </f:view>
</jsp:root>
