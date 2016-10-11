
package com.pronetbeans.examples;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author Adam Myatt
 */
public class MultipleVariableDecsTest {

    public MultipleVariableDecsTest() {
    }

    @BeforeClass
    public static void setUpClass() throws Exception {
    }

    @AfterClass
    public static void tearDownClass() throws Exception {
    }

    @Before
    public void setUp() {
    }

    @After
    public void tearDown() {
    }

    /**
     * Test of doSomething method, of class MultipleVariableDecs.
     */
    @Test
    public void doSomething() {
        System.out.println("doSomething");
        MultipleVariableDecs instance = new MultipleVariableDecs();
        instance.doSomething();
    }

    /**
     * Test of doSomething2 method, of class MultipleVariableDecs.
     */
    @Test
    public void doSomething2() {
        System.out.println("doSomething2");
        MultipleVariableDecs instance = new MultipleVariableDecs();
        instance.doSomething2();
    }

}