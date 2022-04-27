package com.cms.helper;

import java.util.Random;
import java.util.UUID;

import com.cms.model.User;

public class UserHelper {

	public static String generateUrl(User user) {
		String url = "";
		url = user.getEmailAddress() + "&" + UUID.randomUUID().toString();
		return url;
	}

	public static String generateOtp() {
		Random rnd = new Random();
		int number = rnd.nextInt(999999);

		return String.format("%06d", number);
	}

}
