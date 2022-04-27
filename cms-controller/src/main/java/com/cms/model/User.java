package com.cms.model;

import java.sql.Timestamp;

public class User {
	
	private long userId;
	private String firstName;
	private String middleName;
	private String lastName;
	private String address;
	private String mobileNo;
	private String emailAddress;
	private String username;
	private String password;
	private boolean isAdmin;
	private boolean isActivated;
	
	public long getUserId() {
		return userId;
	}
	public void setUserId(long userId) {
		this.userId = userId;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getMiddleName() {
		return middleName;
	}
	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getMobileNo() {
		return mobileNo;
	}
	public void setMobileNo(String mobileNo) {
		this.mobileNo = mobileNo;
	}
	public String getEmailAddress() {
		return emailAddress;
	}
	public void setEmailAddress(String emailAddress) {
		this.emailAddress = emailAddress;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public boolean isAdmin() {
		return isAdmin;
	}
	public void setAdmin(boolean isAdmin) {
		this.isAdmin = isAdmin;
	}
	public boolean isActivated() {
		return isActivated;
	}
	public void setActivated(boolean isActivated) {
		this.isActivated = isActivated;
	}
	
	public static class OTP {
		private long userId;
		private String otp;
		private Timestamp generatedOn;
		private String emailAddress;
		public long getUserId() {
			return userId;
		}
		public void setUserId(long userId) {
			this.userId = userId;
		}
		public String getOtp() {
			return otp;
		}
		public void setOtp(String otp) {
			this.otp = otp;
		}
		public Timestamp getGeneratedOn() {
			return generatedOn;
		}
		public void setGeneratedOn(Timestamp generatedOn) {
			this.generatedOn = generatedOn;
		}
		public String getEmailAddress() {
			return emailAddress;
		}
		public void setEmailAddress(String emailAddress) {
			this.emailAddress = emailAddress;
		}
	}
	
	public static class UserActivation {
		private long userId;
		private String GeneratedUrl;
		private Timestamp generatedOn;
		public long getUserId() {
			return userId;
		}
		public void setUserId(long userId) {
			this.userId = userId;
		}
		public String getGeneratedUrl() {
			return GeneratedUrl;
		}
		public void setGeneratedUrl(String generatedUrl) {
			GeneratedUrl = generatedUrl;
		}
		public Timestamp getGeneratedOn() {
			return generatedOn;
		}
		public void setGeneratedOn(Timestamp generatedOn) {
			this.generatedOn = generatedOn;
		}
	}

}
