package com.pronetbeans.examples;

import org.jdesktop.beansbinding.Validator;

/**
 *
 * @author Adam Myatt
 */
public class DescriptionTextValidator extends Validator {

    @Override
    public Validator.Result validate(Object arg0) {
        
        Validator.Result result = null;
        System.out.println("DescriptionTextValidator.validate has fired.");
        if(arg0 instanceof String) {
            String sResult = (String) arg0;
            
            if(sResult.indexOf('$')!=-1) {
                result = new Validator.Result("123", "Invalid dollar sign");
                System.out.println("The text value contained a dollar sign.");
            }
        }
       
        return result;
    }
    
    
}
