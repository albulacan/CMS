package com.cms;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import com.cms.helper.EmailHelper;
import com.cms.helper.UserHelper;
import com.cms.model.EmailRequest;
import com.cms.model.User;
import com.db.lib.utils.CryptoUtil;

@SpringBootTest
class CmsControllerApplicationTests {

//	@Test
	void contextLoads() {
		User user = new User();
		user.setUserId(1);
		user.setEmailAddress("albulacan@teligent.com.ph");
		
		String url = UserHelper.generateUrl(user);
		System.out.println(url);
	}
	
//	@Test
	void cypto() {
		String text = "System{}123";
		try {
			System.out.println(CryptoUtil.encrypt(text));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@Test
	void email() {
		try {
			EmailHelper emailHelper = new EmailHelper();
			String body = emailHelper.getEmailTemplate("user-activation.html");
			String activationLink = String.format("%s/cms-controller/api/user/activate-account/%d/%s", "http://localhost:8080", 3, "albulacan@teligent.com.ph;0b3cf37e-2a1d-49b8-b221-a1541857d880");
			body = body.replace("&lt;Link&gt;", activationLink);
			EmailRequest emailRequest = new EmailRequest();
			emailRequest.setBody(body);
			emailRequest.setRecipients("bulacanandrewlloyd@gmail.com");
			emailRequest.setSubject("Eric Eugenio's Catering Services: Please validate your email address");
			emailHelper.sendEmail(emailRequest);
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("test");
	}

}
