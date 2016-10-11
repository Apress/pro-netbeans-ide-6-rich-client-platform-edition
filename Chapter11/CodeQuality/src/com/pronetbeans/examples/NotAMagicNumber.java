
package com.pronetbeans.examples;

import java.sql.Connection;
import java.sql.PreparedStatement;

/**
 *
 * @author Adam Myatt
 */
public class NotAMagicNumber {

    public void updateCustomer(int custid,
                               String first,
                               String last,
                               String email,
                               String phone,
                               String company) {

        Connection conn = null;
        PreparedStatement pstmt;

        String sql = "UPDATE customer SET FIRST=?, LAST=?, EMAIL=?, " +
                     "       PHONE=?, COMPANY=? WHERE ID=?";
        try {
            // assume DataSourceFactory does a JDNI lookup
            // and returns a javax.sql.DataSource
            //conn = DataSourceFactory.getDataSource().getConnection;

            pstmt = conn.prepareStatement(sql);


            float fltNum = 1.2f;

            pstmt.setString(1, first);
            pstmt.setString(2, last);
            pstmt.setString(3, email);
            pstmt.setString(4, phone);
            pstmt.setString(5, company);
            pstmt.setInt(6, custid);

        } catch (Exception e) {
            // error handling
        } finally {
            // database connection clean up
        }

    }


    public void updateCustomer2(int custid,
                               String first,
                               String last,
                               String email,
                               String phone,
                               String company) {

        Connection conn = null;
        PreparedStatement pstmt;

        String sql = "UPDATE customer SET FIRST=?, LAST=?, EMAIL=?, " +
                     "       PHONE=?, COMPANY=? WHERE ID=?";
        try {
            // assume DataSourceFactory does a JDNI lookup
            // and returns a javax.sql.DataSource
            //conn = DataSourceFactory.getDataSource().getConnection;

            pstmt = conn.prepareStatement(sql);

            int i = 0;
            pstmt.setString(++i, first);
            pstmt.setString(++i, last);
            pstmt.setString(++i, email);
            pstmt.setString(++i, phone);
            pstmt.setString(++i, company);
            pstmt.setInt(++i, custid);

        } catch (Exception e) {
            // error handling
        } finally {
            // database connection clean up
        }
    }



}
