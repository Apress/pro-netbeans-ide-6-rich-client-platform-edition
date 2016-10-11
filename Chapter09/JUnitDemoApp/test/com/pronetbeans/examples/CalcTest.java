
package com.pronetbeans.examples;

import junit.framework.TestCase;

/**
 *
 * @author Adam Myatt
 */
public class CalcTest extends TestCase {

    public CalcTest(String testName) {
        super(testName);
    }

    @Override
    protected void setUp() throws Exception {
        super.setUp();
    }

    @Override
    protected void tearDown() throws Exception {
        super.tearDown();
    }

    /**
     * Test of checkNum method, of class Calc.
     */
    public void testCheckNum() {
        System.out.println("checkNum");
        int origVal = 0;
        Calc instance = new Calc();
        int expResult = 1;
        int result = instance.checkNum(origVal);
        assertEquals(expResult, result);
        // TODO review the generated test code and remove the default call to fail.
        //fail("The test case is a prototype.");
    }

    /**
     * Test of checkNum method, of class Calc.
     */
    public void testCheckNumFail() {
        int origVal = 20;
        Calc instance = new Calc();

        int expResult = 19;
        int result = instance.checkNum(origVal);
        if(expResult == result) {
            fail("The expected result should NOT match the actual result.");
        }

    }
}
