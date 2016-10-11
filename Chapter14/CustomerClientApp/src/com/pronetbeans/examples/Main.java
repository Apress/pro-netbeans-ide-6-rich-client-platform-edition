
package com.pronetbeans.examples;

/**
 *
 * @author Adam Myatt
 */
public class Main {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {

        try {
            // Call Web Service Operation
            CustomerInfoService service = new CustomerInfoService();
            CustomerInfo port = service.getCustomerInfoPort();
            // TODO initialize WS operation arguments here
            long lngCustomerId = 1234567890;
            // TODO process result here
            Customer result = port.getCustomerById(lngCustomerId);
            System.out.println("Result = " + result.getFirstName());
        } catch (Exception ex) {
            // TODO handle custom exceptions here
        }
    }
}