
package com.pronetbeans.examples.services;

import javax.jws.HandlerChain;
import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;

/**
 *
 * @author Adam Myatt
 */
@WebService
@HandlerChain(file = "CustomerInfo_handler.xml")
public class CustomerInfo {

/**
     * Web service operation
     */
    @WebMethod(operationName = "getCustomerById")
    public Customer getCustomerById(@WebParam(name = "lngCustomerId")
    long lngCustomerId) {

        Customer cust = new Customer();

        if (lngCustomerId == 1234567890) {
            cust.setId(1234567890);
            cust.setFirstName("Adam");
            cust.setLastName("Myatt");
        } else if (lngCustomerId == 123) {
            cust.setId(123);
            cust.setFirstName("John");
            cust.setLastName("Doe");
        } else {
            cust.setId(-1);
            cust.setFirstName("");
            cust.setLastName("");
        }
        return cust;
    }
}