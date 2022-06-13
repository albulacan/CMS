package com.cms.model;

import java.math.BigDecimal;

public class Optional {
	
	private long optionId;
	private long packageId;
	private String description;
	private BigDecimal price;
	private long reservationPackageId;
	private boolean isChecked;
	
	public long getOptionId() {
		return optionId;
	}
	public void setOptionId(long optionId) {
		this.optionId = optionId;
	}
	public long getPackageId() {
		return packageId;
	}
	public void setPackageId(long packageId) {
		this.packageId = packageId;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public BigDecimal getPrice() {
		return price;
	}
	public void setPrice(BigDecimal price) {
		this.price = price;
	}
	public long getReservationPackageId() {
		return reservationPackageId;
	}
	public void setReservationPackageId(long reservationPackageId) {
		this.reservationPackageId = reservationPackageId;
	}
	public boolean isChecked() {
		return isChecked;
	}
	public void setChecked(boolean isChecked) {
		this.isChecked = isChecked;
	}

}
