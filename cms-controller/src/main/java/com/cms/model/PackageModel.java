package com.cms.model;

import java.math.BigDecimal;

public class PackageModel {

	private long packageId;
	private String name;
	private String description;
	private int pax;
	private int menu;
	private String addsOn;
	private BigDecimal price;
	private boolean isDeleted;
	
	private int totalRecords;
	
	public long getPackageId() {
		return packageId;
	}
	public void setPackageId(long packageId) {
		this.packageId = packageId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public int getPax() {
		return pax;
	}
	public void setPax(int pax) {
		this.pax = pax;
	}
	public int getMenu() {
		return menu;
	}
	public void setMenu(int menu) {
		this.menu = menu;
	}
	public String getAddsOn() {
		return addsOn;
	}
	public void setAddsOn(String addsOn) {
		this.addsOn = addsOn;
	}
	public BigDecimal getPrice() {
		return price;
	}
	public void setPrice(BigDecimal price) {
		this.price = price;
	}
	public boolean isDeleted() {
		return isDeleted;
	}
	public void setDeleted(boolean isDeleted) {
		this.isDeleted = isDeleted;
	}
	public int getTotalRecords() {
		return totalRecords;
	}
	public void setTotalRecords(int totalRecords) {
		this.totalRecords = totalRecords;
	}

}
