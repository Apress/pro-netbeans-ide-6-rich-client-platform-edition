<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.1" xmlns:f="http://java.sun.com/jsf/core" xmlns:h="http://java.sun.com/jsf/html" xmlns:jsp="http://java.sun.com/JSP/Page" xmlns:webuijsf="http://www.sun.com/webui/webuijsf">
    <jsp:directive.page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"/>
    <f:view>
        <webuijsf:page binding="#{Products.page1}" id="page1">
            <webuijsf:html binding="#{Products.html1}" id="html1">
                <webuijsf:head binding="#{Products.head1}" id="head1">
                    <webuijsf:link binding="#{Products.link1}" id="link1" url="/resources/stylesheet.css"/>
                </webuijsf:head>
                <webuijsf:body binding="#{Products.body1}" id="body1" style="-rave-layout: grid">
                    <webuijsf:form binding="#{Products.form1}" id="form1">
                        <webuijsf:textField binding="#{Products.textField1}" id="textField1" style="left: 96px; top: 24px; position: absolute" text="Test"/>
                        <webuijsf:label binding="#{Products.label1}" id="label1" style="position: absolute; left: 24px; top: 24px" text="Label"/>
                        <webuijsf:label binding="#{Products.label2}" id="label2" style="left: 24px; top: 48px; position: absolute" text="Label"/>
                        <webuijsf:label binding="#{Products.label3}" id="label3" style="left: 24px; top: 72px; position: absolute" text="Label"/>
                        <webuijsf:textField binding="#{Products.textField2}" id="textField2" style="left: 96px; top: 48px; position: absolute"/>
                        <webuijsf:textArea binding="#{Products.textArea1}" id="textArea1" rows="5" style="left: 96px; top: 72px; position: absolute"/>
                        <webuijsf:button binding="#{Products.button1}" id="button1" style="left: 95px; top: 168px; position: absolute" text="Submit"/>
                        <webuijsf:button binding="#{Products.button2}" id="button2" style="left: 167px; top: 168px; position: absolute" text="Reset"/>
                        <webuijsf:checkbox binding="#{Products.checkbox1}" id="checkbox1" label="Checkbox" style="left: 96px; top: 192px; position: absolute"/>
                        <webuijsf:radioButton binding="#{Products.radioButton1}" id="radioButton1" label="Radio Button" name="radioButton-group-form1" style="left: 96px; top: 216px; position: absolute"/>
                        <webuijsf:upload binding="#{Products.fileUpload1}" id="fileUpload1" style="left: 96px; top: 264px; position: absolute"/>
                        <webuijsf:hyperlink binding="#{Products.hyperlink1}" id="hyperlink1" style="left: 264px; top: 24px; position: absolute" text="Hyperlink"/>
                        <webuijsf:listbox binding="#{Products.listbox1}" id="listbox1" items="#{Products.listbox1DefaultOptions.options}" rows="4" style="left: 264px; top: 72px; position: absolute"/>
                        <webuijsf:calendar binding="#{Products.calendar1}" id="calendar1" style="left: 264px; top: 192px; position: absolute"/>
                        <webuijsf:radioButtonGroup binding="#{Products.radioButtonGroup1}" id="radioButtonGroup1"
                            items="#{Products.radioButtonGroup1DefaultOptions.options}" style="position: absolute; left: 360px; top: 24px"/>
                        <webuijsf:checkboxGroup binding="#{Products.checkboxGroup1}" id="checkboxGroup1"
                            items="#{Products.checkboxGroup1DefaultOptions.options}" style="left: 360px; top: 104px; position: absolute"/>
                    </webuijsf:form>
                </webuijsf:body>
            </webuijsf:html>
        </webuijsf:page>
    </f:view>
</jsp:root>
