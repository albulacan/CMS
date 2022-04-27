package com.cms.controller;

import java.sql.Timestamp;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.cms.helper.EmailHelper;
import com.cms.helper.UserHelper;
import com.cms.model.EmailRequest;
import com.cms.model.HttpResponse;
import com.cms.model.User;
import com.cms.model.User.OTP;
import com.cms.model.User.UserActivation;
import com.cms.repository.UserRepository;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/user")
public class UserController {
	
	@PostMapping("/admin-login")
	public HttpResponse<User> adminLogin(@RequestBody User request) {
		UserRepository repo = null;
		try {
			repo = new UserRepository();
			request = repo.authenticateAdmin(request);
			if (request == null || request.getUserId() <= 0) {
				return HttpResponse.failed("Invalid username or password.");
			}
			return HttpResponse.success(request);
		} catch (Exception e) {
			System.out.println(e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			repo.dispose();
		}
	}
	
	@PostMapping("/client-login")
	public HttpResponse<User> clientLogin(@RequestBody User request) {
		UserRepository repo = null;
		try {
			repo = new UserRepository();
			request = repo.authenticateClient(request);
			if (request == null || request.getUserId() <= 0) {
				return HttpResponse.failed("Invalid email or password.");
			}
			if (!request.isActivated()) {
				return HttpResponse.failed("Please activate your email first to login.");
			}
			return HttpResponse.success(request);
		} catch (Exception e) {
			System.out.println(e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			repo.dispose();
		}
	}
	
	@PostMapping("/sign-up")
	public HttpResponse<User> signUp(@RequestBody User request, HttpServletRequest servletRequest) {
		UserRepository repo = null;
		try {
			repo = new UserRepository();
			User user = repo.getUserByEmail(request.getEmailAddress());
			if (user != null && request.getUserId() > 0) {
				return HttpResponse.failed("Email address already exists.");
			}
			request.setUserId(repo.save(request));
			String url = UserHelper.generateUrl(request);
			repo.setValidationUrl(request.getUserId(), url);
			
			//email sending
			String baseUrl = ServletUriComponentsBuilder.fromRequestUri(servletRequest)
		            .replacePath(null)
		            .build()
		            .toUriString();
			EmailHelper emailHelper = new EmailHelper();
			String body = emailHelper.getEmailTemplate("user-activation.html");
			String activationLink = String.format("%s/cms-controller/api/user/activate-account/%d/%s", baseUrl, request.getUserId(), url);
			body = body.replace("&lt;Link&gt;", activationLink);
			EmailRequest emailRequest = new EmailRequest();
			emailRequest.setBody(body);
			emailRequest.setRecipients(request.getEmailAddress());
			emailRequest.setSubject("Eric Eugenio's Catering Services: Please validate your email address");
			emailHelper.sendEmail(emailRequest);
			
			repo.commit();
			return HttpResponse.success();
		} catch (Exception e) {
			System.out.println(e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			repo.dispose();
		}
	}
	
	@GetMapping("/activate-account/{userId}/{url}")
	public ResponseEntity<String> activateAccount(@PathVariable(value="userId") long userId, @PathVariable(value="url") String url) {
		UserRepository repo = null;
		try {
			repo = new UserRepository();
			User user = repo.getUserById(userId);
			if (user == null) {
				return new ResponseEntity<String>("Invalid activation link.", HttpStatus.OK);
			}
			if (user.isActivated()) {
				return new ResponseEntity<String>("Account is already activated.", HttpStatus.OK);
			}
			UserActivation activation = repo.getUserActivation(userId);
			if (activation.getGeneratedUrl().equals(url)) {
				repo.activateUser(userId);
			} else {
				return new ResponseEntity<String>("Invalid activation link.", HttpStatus.OK);
			}
			return new ResponseEntity<String>("Account successfully acitvated. <a href='http://localhost:4200'>Click this link to login.</a>", HttpStatus.OK);
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		} finally {
			repo.dispose();
		}
	}
	
	@PostMapping("/request-otp")
	public HttpResponse<OTP> requestOtp(@RequestBody OTP request) {
		UserRepository repo = null;
		try {
			repo = new UserRepository();
			User user = repo.getUserByEmail(request.getEmailAddress());
			if (user == null || user.getUserId() <= 0) {
				return HttpResponse.failed("Email address does not exist.");
			}
			request.setOtp(UserHelper.generateOtp());
			// email otp
			EmailHelper emailHelper = new EmailHelper();
			String body = emailHelper.getEmailTemplate("otp.html");
			body = body.replace("&lt;OTP&gt;", request.getOtp());
			EmailRequest emailRequest = new EmailRequest();
			emailRequest.setBody(body);
			emailRequest.setRecipients(user.getEmailAddress());
			emailRequest.setSubject("Eric Eugenio's Catering Services: Request to reset password");
			emailHelper.sendEmail(emailRequest);
			
			repo.setOTP(user.getUserId(), request.getOtp());
			return HttpResponse.success();
		} catch (Exception e) {
			System.out.println(e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			repo.dispose();
		}
	}
	
	@PostMapping("/validate-otp")
	public HttpResponse<OTP> validateOtp(@RequestBody OTP request) {
		UserRepository repo = null;
		try {
			repo = new UserRepository();
			User user = repo.getUserByEmail(request.getEmailAddress());
			if (user == null || user.getUserId() <= 0) {
				return HttpResponse.failed("Email address does not exist.");
			}
			OTP otp = repo.getOTP(user.getUserId());
			if (otp == null) {
				return HttpResponse.failed("Invalid OTP.");
			}
			Timestamp current = new Timestamp(System.currentTimeMillis());
			Long diff = Math.abs(current.getTime() - otp.getGeneratedOn().getTime());
			long minutes = TimeUnit.MINUTES.convert(diff, TimeUnit.MILLISECONDS);
			if (minutes > 30) {
				return HttpResponse.failed("OTP in already expired.");
			}
			if (!otp.getOtp().equals(request.getOtp())) {
				return HttpResponse.failed("Invalid OTP.");
			}
			return HttpResponse.success();
		} catch (Exception e) {
			System.out.println(e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			repo.dispose();
		}
	}
	
	@PostMapping("/update-password")
	public HttpResponse<OTP> updatePassword(@RequestBody User request) {
		UserRepository repo = null;
		try {
			repo = new UserRepository();
			User user = repo.getUserByEmail(request.getEmailAddress());
			if (user == null || user.getUserId() <= 0) {
				return HttpResponse.failed("Email address does not exist.");
			}
			repo.updatePassword(user.getUserId(), request.getPassword());
			repo.deleteOTP(user.getUserId());
			repo.commit();
			return HttpResponse.success();
		} catch (Exception e) {
			System.out.println(e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			repo.dispose();
		}
	}

}
