package com.oy.clientdemo;

/**
 * Created by Lucky on 2017/1/14.
 */
public class Entity {
    private String customerID;
    private String customerKey;

    public String getCustomerID() {
        return customerID;
    }

    public void setCustomerID(String customerID) {
        this.customerID = customerID;
    }

    public String getCustomerKey() {
        return customerKey;
    }

    public void setCustomerKey(String customerKey) {
        this.customerKey = customerKey;
    }

    @Override
    public String toString() {
        return "Entity{" +
                "customerID='" + customerID + '\'' +
                ", customerKey='" + customerKey + '\'' +
                '}';
    }
}
