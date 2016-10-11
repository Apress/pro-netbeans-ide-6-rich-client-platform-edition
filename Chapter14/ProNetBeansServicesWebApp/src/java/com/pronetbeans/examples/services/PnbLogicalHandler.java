

package com.pronetbeans.examples.services;

import javax.xml.ws.LogicalMessage;
import javax.xml.ws.handler.LogicalHandler;
import javax.xml.ws.handler.LogicalMessageContext;
import javax.xml.ws.handler.MessageContext;

/**
 *
 * @author Adam Myatt
 */
public class PnbLogicalHandler implements LogicalHandler<LogicalMessageContext> {

    public boolean handleMessage(LogicalMessageContext messageContext) {
        LogicalMessage msg = messageContext.getMessage();
        return true;
    }

    public boolean handleFault(LogicalMessageContext messageContext) {
        return true;
    }

    public void close(MessageContext context) {
    }

}
