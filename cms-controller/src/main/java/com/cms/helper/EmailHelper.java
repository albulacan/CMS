package com.cms.helper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.stream.Collectors;

import javax.mail.Authenticator;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import org.apache.log4j.Logger;

import com.cms.model.EmailRequest;
import com.cms.model.EmailSettings;
import com.db.lib.utils.CryptoUtil;
import com.db.lib.utils.PropertiesReader;
import com.microsoft.sqlserver.jdbc.StringUtils;

public class EmailHelper {
	private static Logger LOGGER = Logger.getLogger(EmailHelper.class);
	
	ClassLoader classLoader = null;
	SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	EmailSettings config = new EmailSettings();
	
	public EmailHelper() {
		classLoader = getClass().getClassLoader();
		setEmailConfig();
	}
	
	private void setEmailConfig() {
		try {
			PropertiesReader reader = new PropertiesReader("email.properties");
			config.setSmtpServer(reader.getProperty("smtp.server"));
			config.setSmtpPort(Integer.parseInt(reader.getProperty("smtp.port")));
			config.setUsername(reader.getProperty("smtp.user"));
			config.setPassword(CryptoUtil.decrypt(reader.getProperty("smtp.password")));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public String getEmailTemplate(String templateName) throws IOException, URISyntaxException {
		InputStream is = classLoader.getResourceAsStream("templates/" + templateName);
        if (is == null) {
            throw new IllegalArgumentException("file not found! " + templateName);
        }
        String content = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8)).lines().collect(Collectors.joining("\n"));
        return content;
    }
	
	public void sendEmail(EmailRequest request) throws Exception {
		try {
			List<String> recipients = null;
			List<String> cCopys = null;
			if (!StringUtils.isEmpty(request.getRecipients())) {
				recipients = Arrays.asList(request.getRecipients().split(","));
			}
			
			if (!StringUtils.isEmpty(request.getcCopy())) {
				cCopys = Arrays.asList(request.getcCopy().split(","));
			}
			
			Session session = this.getSession(config);
	
			if (!StringUtils.isEmpty(config.getUsername()) && !StringUtils.isEmpty(config.getPassword())) {
				session = this.getSSLAuthentication(config, config.getUsername(), config.getPassword());
			}
			
			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress(String.format("Eric Eugenios Catering Services <%s>", config.getSmtpServer())));
			message.setSubject(request.getSubject());
			message.setSentDate(new Date());
			
			Multipart messageBody = this.getMessageBody(request);
			message.setContent(messageBody);
			
			if (recipients != null && !recipients.isEmpty()) {
				for (String recipient : recipients) {
					message.addRecipients(Message.RecipientType.TO, InternetAddress.parse(recipient.trim(), true));
				}
			}
			
			if (cCopys != null && !cCopys.isEmpty()) {
				for (String cCopy: cCopys) {
					message.addRecipients(Message.RecipientType.CC, InternetAddress.parse(cCopy.trim(), true));
				}
			}
			
			Transport.send(message);
		} catch (Exception e) {
			LOGGER.error("An error occured when sending email. From: " + config.getUsername() + ", To: " + request.getRecipients(), e);
			throw e;
		}
	}
	
	private Session getSession(EmailSettings config) {
		Properties props = System.getProperties();
		props.put("mail.smtp.host", config.getSmtpServer());
		props.put("mail.smtp.port", config.getSmtpPort());
		props.put("mail.smtp.ssl.trust", config.getSmtpServer());
		props.put("mail.smtp.connectiontimeout", 30 * 60000);
		props.put("mail.smtp.timeout", 30 * 60000);
		props.put("mail.smtp.socketFactory.fallback", "true");
		props.remove("mail.smtp.socketFactory.port");
		props.remove("mail.smtp.socketFactory.class");
		props.remove("mail.smtp.auth");
		
		return Session.getInstance(props);
	}
	
	private Session getSSLAuthentication(EmailSettings config, final String username, final String password) throws Exception {
		Properties props = System.getProperties();
		props.put("mail.smtp.host", config.getSmtpServer());
		props.put("mail.smtp.socketFactory.port", config.getSmtpPort());
		props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.port", config.getSmtpPort());
		props.put("mail.smtp.socketFactory.fallback", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.EnableSSL.enable", "true");
		
		Authenticator auth = new Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		};
		
		return Session.getInstance(props, auth);
	}
	
	private Multipart getMessageBody(EmailRequest request) throws Exception {
		Multipart multipart = new MimeMultipart();
		BodyPart msgBodyPart = new MimeBodyPart(); 
		msgBodyPart.setContent(request.getBody(), "text/html");
		multipart.addBodyPart(msgBodyPart);
		return multipart;
	}
	
}
