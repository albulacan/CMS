package com.cms.repository;

import java.sql.JDBCType;

import com.cms.model.User;
import com.cms.model.User.OTP;
import com.cms.model.User.UserActivation;
import com.db.lib.DbWorker;
import com.db.lib.models.ParameterDirection;
import com.db.lib.models.SQLCommandType;
import com.db.lib.models.SQLResult;

public class UserRepository extends DbWorker {

	public UserRepository() throws Exception {
		super();
	}
	
	public User authenticateAdmin(User user) throws Exception {
		SQLResult<User> sqlResult = SelectRecord(String.format("SELECT * FROM dbo.[User] WHERE Username = '%s' AND Password = '%s' AND IsAdmin = 1", user.getEmailAddress(), user.getPassword()), SQLCommandType.Text, User.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public User authenticateClient(User user) throws Exception {
		SQLResult<User> sqlResult = SelectRecord(String.format("SELECT * FROM dbo.[User] WHERE EmailAddress = '%s' AND Password = '%s'", user.getEmailAddress(), user.getPassword()), SQLCommandType.Text, User.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public User getUserByEmail(String emailAddress) throws Exception {
		SQLResult<User> sqlResult = SelectRecord(String.format("SELECT * FROM dbo.[User] WHERE EmailAddress = '%s'", emailAddress), SQLCommandType.Text, User.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public User getUserById(long userId) throws Exception {
		SQLResult<User> sqlResult = SelectRecord(String.format("SELECT * FROM dbo.[User] WHERE UserId = %d", userId), SQLCommandType.Text, User.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public UserActivation getUserActivation(long userId) throws Exception {
		SQLResult<UserActivation> sqlResult = SelectRecord(String.format("SELECT TOP 1 * FROM dbo.UserActivation WHERE UserId = %d ORDER BY GeneratedOn DESC", userId), SQLCommandType.Text, UserActivation.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public OTP getOTP(long userId) throws Exception {
		SQLResult<OTP> sqlResult = SelectRecord(String.format("SELECT TOP 1 * FROM dbo.OTP WHERE UserId = %d ORDER BY GeneratedOn DESC", userId), SQLCommandType.Text, OTP.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public long save(User request) throws Exception {
		AddParameter("UserId", request.getUserId(), JDBCType.BIGINT, ParameterDirection.OUT);
		AddParameter("FirstName", request.getFirstName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("MiddleName", request.getMiddleName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("LastName", request.getLastName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Address", request.getAddress(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("MobileNo", request.getMobileNo(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("EmailAddress", request.getEmailAddress(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Username", request.getUsername(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Password", request.getPassword(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("IsAdmin", request.isAdmin(), JDBCType.BIT, ParameterDirection.IN);
		AddParameter("IsActivated", request.isActivated(), JDBCType.BIT, ParameterDirection.IN);
		
		SQLResult<?> sqlResult = SaveRecordWithoutCommit("usp_cms_SaveUser", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		long userId = request.getUserId();
		if (outputParameters.size() > 0) {
			userId = (Long) outputParameters.get("UserId");
        }
		return userId;
	}
	
	public void activateUser(long userId) throws Exception {
		SQLResult<?> sqlResult = SaveRecordAutoCommit(String.format("UPDATE dbo.[User] SET IsActivated = 1 WHERE UserId = %d", userId), SQLCommandType.Text);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	public void updatePassword(long userId, String password) throws Exception {
		SQLResult<?> sqlResult = SaveRecordWithoutCommit(String.format("UPDATE dbo.[User] SET Password = '%s' WHERE UserId = %d", password, userId), SQLCommandType.Text);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	public void setValidationUrl(long userId, String url) throws Exception {
		SQLResult<?> sqlResult = SaveRecordWithoutCommit(String.format("INSERT INTO dbo.UserActivation (UserId, GeneratedUrl, GeneratedOn) VALUES (%d, '%s', GETDATE())", userId, url), SQLCommandType.Text);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	public void setOTP(long userId, String otp) throws Exception {
		SQLResult<?> sqlResult = SaveRecordAutoCommit(String.format("INSERT INTO dbo.OTP (UserId, OTP, GeneratedOn) VALUES (%d, '%s', GETDATE())", userId, otp), SQLCommandType.Text);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	public void deleteOTP(long userId) throws Exception {
		SQLResult<?> sqlResult = SaveRecordWithoutCommit(String.format("DELETE FROM dbo.OTP WHERE UserId = %d", userId), SQLCommandType.Text);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}

}
