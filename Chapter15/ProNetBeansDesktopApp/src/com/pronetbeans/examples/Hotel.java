/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.pronetbeans.examples;

import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

/**
 *
 * @author Adam Myatt
 */
@Entity
@Table(name = "HOTEL")
@NamedQueries({@NamedQuery(name = "Hotel.findByTripid", query = "SELECT h FROM Hotel h WHERE h.tripid = :tripid"), @NamedQuery(name = "Hotel.findByHotelid", query = "SELECT h FROM Hotel h WHERE h.hotelid = :hotelid"), @NamedQuery(name = "Hotel.findByHotelname", query = "SELECT h FROM Hotel h WHERE h.hotelname = :hotelname"), @NamedQuery(name = "Hotel.findByCheckindate", query = "SELECT h FROM Hotel h WHERE h.checkindate = :checkindate"), @NamedQuery(name = "Hotel.findByCheckoutdate", query = "SELECT h FROM Hotel h WHERE h.checkoutdate = :checkoutdate"), @NamedQuery(name = "Hotel.findByGuests", query = "SELECT h FROM Hotel h WHERE h.guests = :guests"), @NamedQuery(name = "Hotel.findByBookingstatus", query = "SELECT h FROM Hotel h WHERE h.bookingstatus = :bookingstatus"), @NamedQuery(name = "Hotel.findByLastupdated", query = "SELECT h FROM Hotel h WHERE h.lastupdated = :lastupdated")})
public class Hotel implements Serializable {
    @Transient
    private PropertyChangeSupport changeSupport = new PropertyChangeSupport(this);
    private static final long serialVersionUID = 1L;
    @Column(name = "TRIPID", nullable = false)
    private int tripid;
    @Id
    @Column(name = "HOTELID", nullable = false)
    private Integer hotelid;
    @Column(name = "HOTELNAME")
    private String hotelname;
    @Column(name = "CHECKINDATE")
    @Temporal(TemporalType.DATE)
    private Date checkindate;
    @Column(name = "CHECKOUTDATE")
    @Temporal(TemporalType.DATE)
    private Date checkoutdate;
    @Column(name = "GUESTS")
    private Integer guests;
    @Column(name = "BOOKINGSTATUS")
    private String bookingstatus;
    @Column(name = "LASTUPDATED")
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastupdated;

    public Hotel() {
    }

    public Hotel(Integer hotelid) {
        this.hotelid = hotelid;
    }

    public Hotel(Integer hotelid, int tripid) {
        this.hotelid = hotelid;
        this.tripid = tripid;
    }

    public int getTripid() {
        return tripid;
    }

    public void setTripid(int tripid) {
        int oldTripid = this.tripid;
        this.tripid = tripid;
        changeSupport.firePropertyChange("tripid", oldTripid, tripid);
    }

    public Integer getHotelid() {
        return hotelid;
    }

    public void setHotelid(Integer hotelid) {
        Integer oldHotelid = this.hotelid;
        this.hotelid = hotelid;
        changeSupport.firePropertyChange("hotelid", oldHotelid, hotelid);
    }

    public String getHotelname() {
        return hotelname;
    }

    public void setHotelname(String hotelname) {
        String oldHotelname = this.hotelname;
        this.hotelname = hotelname;
        changeSupport.firePropertyChange("hotelname", oldHotelname, hotelname);
    }

    public Date getCheckindate() {
        return checkindate;
    }

    public void setCheckindate(Date checkindate) {
        Date oldCheckindate = this.checkindate;
        this.checkindate = checkindate;
        changeSupport.firePropertyChange("checkindate", oldCheckindate, checkindate);
    }

    public Date getCheckoutdate() {
        return checkoutdate;
    }

    public void setCheckoutdate(Date checkoutdate) {
        Date oldCheckoutdate = this.checkoutdate;
        this.checkoutdate = checkoutdate;
        changeSupport.firePropertyChange("checkoutdate", oldCheckoutdate, checkoutdate);
    }

    public Integer getGuests() {
        return guests;
    }

    public void setGuests(Integer guests) {
        Integer oldGuests = this.guests;
        this.guests = guests;
        changeSupport.firePropertyChange("guests", oldGuests, guests);
    }

    public String getBookingstatus() {
        return bookingstatus;
    }

    public void setBookingstatus(String bookingstatus) {
        String oldBookingstatus = this.bookingstatus;
        this.bookingstatus = bookingstatus;
        changeSupport.firePropertyChange("bookingstatus", oldBookingstatus, bookingstatus);
    }

    public Date getLastupdated() {
        return lastupdated;
    }

    public void setLastupdated(Date lastupdated) {
        Date oldLastupdated = this.lastupdated;
        this.lastupdated = lastupdated;
        changeSupport.firePropertyChange("lastupdated", oldLastupdated, lastupdated);
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (hotelid != null ? hotelid.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Hotel)) {
            return false;
        }
        Hotel other = (Hotel) object;
        if ((this.hotelid == null && other.hotelid != null) || (this.hotelid != null && !this.hotelid.equals(other.hotelid))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.pronetbeans.examples.Hotel[hotelid=" + hotelid + "]";
    }

    public void addPropertyChangeListener(PropertyChangeListener listener) {
        changeSupport.addPropertyChangeListener(listener);
    }

    public void removePropertyChangeListener(PropertyChangeListener listener) {
        changeSupport.addPropertyChangeListener(listener);
    }

}
