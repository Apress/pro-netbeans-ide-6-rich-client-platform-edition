/*
 * MyMainTest.java
 * JUnit 4.x based test
 *
 */

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
public class MyMainTest
{

    public MyMainTest()
    {
    }

    @BeforeClass
    public static void setUpClass() throws Exception {
    }

    @AfterClass
    public static void tearDownClass() throws Exception {
    }

    @Before
    public void setUp() throws Exception {
    }

    @After
    public void tearDown() throws Exception {
    }

    @Test
    public void main() {
        System.out.println("main");
        String[] args = null;
        MyMain.main(args);
        fail("The test case is a prototype.");
    } /* Test of main method, of class MyMain. */

    @Test
    public void getLastName() {
        System.out.println("getLastName");
        MyMain instance = new MyMain();
        String expResult = "";
        String result = instance.getLastName();
        assertEquals(expResult, result);
        fail("The test case is a prototype.");
    } /* Test of getLastName method, of class MyMain. */

    @Test
    public void getFirstName() {
        System.out.println("getFirstName");
        MyMain instance = new MyMain();
        String expResult = "";
        String result = instance.getFirstName();
        assertEquals(expResult, result);
        fail("The test case is a prototype.");
    } /* Test of getFirstName method, of class MyMain. */

}
