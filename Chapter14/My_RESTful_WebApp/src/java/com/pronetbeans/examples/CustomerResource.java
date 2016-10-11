
package com.pronetbeans.examples;

import javax.ws.rs.UriTemplate;
import javax.ws.rs.UriParam;
import javax.ws.rs.HttpMethod;
import javax.ws.rs.ProduceMime;
import javax.ws.rs.ConsumeMime;
import javax.ws.rs.core.HttpContext;
import javax.ws.rs.core.UriInfo;

/**
 * REST Web Service
 *
 * @author Adam Myatt
 */
@UriTemplate(value = "customer")
public class CustomerResource {

    @HttpContext
    private UriInfo context;

    /** Creates a new instance of CustomerResource */
    public CustomerResource() {
    }

    /**
     * Retrieves representation of an instance of com.pronetbeans.examples.CustomerResource
     * @return an instance of java.lang.String
     */
    @HttpMethod(value = "GET")
    @ProduceMime(value = "text/html")
    public String getHtml() {
        return "Hello RESTful World";
    }

    /**
     * PUT method for updating or creating an instance of CustomerResource
     * @param content representation for the resource
     * @return an HTTP response with content of the updated or created resource.
     */
    @HttpMethod(value = "PUT")
    @ConsumeMime(value = "text/html")
    public void putHtml(String content) {
    }
}