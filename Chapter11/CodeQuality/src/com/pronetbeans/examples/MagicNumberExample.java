
package com.pronetbeans.examples;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 *
 * @author Adam Myatt
 */
public class MagicNumberExample {

    public List<String> calculate(List<String> data) throws Exception{

        final List<String> returnData = new ArrayList();
        final Iterator<String> mydata = data.iterator();

        while(mydata.hasNext()) {
            String nextVal = mydata.next();

            if(nextVal.length()<5) {
                returnData.add(nextVal);
            }

            // do something else

            if(nextVal.length()<5) {
               // log the data String
            }
        }

        return returnData;
    }
}