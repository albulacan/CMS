package com.cms.repository;

import java.sql.Date;
import java.sql.JDBCType;
import java.util.List;

import com.cms.model.Appointment;
import com.cms.model.DataGridRequest;
import com.cms.model.Menu;
import com.cms.model.Optional;
import com.cms.model.PackageModel;
import com.cms.model.Payment;
import com.cms.model.Reservation;
import com.cms.model.User;
import com.db.lib.DbWorker;
import com.db.lib.models.ParameterDirection;
import com.db.lib.models.SQLCommandType;
import com.db.lib.models.SQLResult;

public class ReservationRepository extends DbWorker {

	public ReservationRepository() throws Exception {
		super();
	}
	
	public List<Reservation> getDataGrid(DataGridRequest<Reservation> request) throws Exception {
		AddParameter("ClientName", request.getSearch().getClientName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Status", request.getSearch().getStatus(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Start", request.getStart(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("Length", request.getLength(), JDBCType.INTEGER, ParameterDirection.IN);
		
		SQLResult<List<Reservation>> sqlResult = SelectRecords("usp_cms_GetDataGridReservations", SQLCommandType.StoredProcedure, Reservation.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<Reservation> getAllByUserId(long userId) throws Exception {
		SQLResult<List<Reservation>> sqlResult = SelectRecords(String.format("SELECT * FROM dbo.Reservation WHERE UserId = %d ORDER BY ReservationId DESC", userId), SQLCommandType.Text, Reservation.class);
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<Reservation> getAllByYearMonth(String year, String month) throws Exception {
		SQLResult<List<Reservation>> sqlResult = SelectRecords(String.format("SELECT * FROM dbo.Reservation WHERE DATEPART(YEAR, CreatedOn) = '%s' AND DATEPART(MONTH, CreatedOn) = '%s'", year, month), SQLCommandType.Text, Reservation.class);
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public Reservation getByDate(Date date) throws Exception {
		AddParameter("Date", date, JDBCType.DATE, ParameterDirection.IN);
		SQLResult<Reservation> sqlResult = SelectRecord("usp_cms_SelectReservationByDate", SQLCommandType.StoredProcedure, Reservation.class);
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public Reservation getById(long reservationId) throws Exception {
		SQLResult<Reservation> sqlResult = SelectRecord(String.format("SELECT * FROM dbo.[Reservation] WHERE ReservationId = %d", reservationId), SQLCommandType.Text, Reservation.class);
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public Reservation getByReferenceNo(String referenceNo) throws Exception {
		SQLResult<Reservation> sqlResult = SelectRecord(String.format("SELECT * FROM dbo.[Reservation] WHERE ReferenceNo = '%s'", referenceNo), SQLCommandType.Text, Reservation.class);
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public Reservation getByReferenceNoAndUser(String referenceNo, long userId) throws Exception {
		SQLResult<Reservation> sqlResult = SelectRecord(String.format("SELECT * FROM dbo.[Reservation] WHERE ReferenceNo = '%s' AND UserId = %d", referenceNo, userId), SQLCommandType.Text, Reservation.class);
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<PackageModel> getPackages(long reservationId) throws Exception {
		AddParameter("ReservationId", reservationId, JDBCType.BIGINT, ParameterDirection.IN);
		SQLResult<List<PackageModel>> sqlResult = SelectRecords("usp_cms_GetPackagesByReservationId", SQLCommandType.StoredProcedure, PackageModel.class);
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<Menu> getMenus(long reservationId) throws Exception {
		AddParameter("ReservationId", reservationId, JDBCType.BIGINT, ParameterDirection.IN);
		SQLResult<List<Menu>> sqlResult = SelectRecords("usp_cms_GetMenusByReservationId", SQLCommandType.StoredProcedure, Menu.class);
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
	
	public long save(Reservation request) throws Exception {
		AddParameter("UserId", request.getUserId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("Date", request.getDate(), JDBCType.DATE, ParameterDirection.IN);
		AddParameter("Time", request.getTime(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Pax", request.getPax(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("Venue", request.getVenue(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Ocassion", request.getOccasion(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("TableService", request.getTableService(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Motif", request.getMotif(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Theme", request.getTheme(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("PaymentOption", request.getPaymentOption(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("PaymentMethod", request.getPaymentMethod(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("AppointmentDate", request.getAppointmentDate(), JDBCType.DATE, ParameterDirection.IN);
		AddParameter("AmountDue", request.getAmountDue(), JDBCType.DECIMAL, ParameterDirection.IN);
		AddParameter("AmountPaid", request.getAmountPaid(), JDBCType.DECIMAL, ParameterDirection.IN);
		AddParameter("Status", request.getStatus(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("ReservationId", JDBCType.BIGINT, ParameterDirection.OUT);
		AddParameter("InReservationId", request.getReservationId(), JDBCType.BIGINT, ParameterDirection.IN);
		
		SQLResult<?> sqlResult = SaveRecordWithoutCommit("usp_cms_SaveReservation", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		long reservationId = 0;
		if (outputParameters.size() > 0) {
			reservationId = (Long) outputParameters.get("ReservationId");
        }
		return reservationId;
	}
	
	public long savePackage(long reservationId, long packageId) throws Exception {
		AddParameter("ReservationId", reservationId, JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("PackageId", packageId, JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("ReservationPackageId", JDBCType.BIGINT, ParameterDirection.OUT);
		SQLResult<?> sqlResult = SaveRecordWithoutCommit("usp_cms_SaveReservationPackage", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		long reservationPackageId = 0;
		if (outputParameters.size() > 0) {
			reservationPackageId = (Long) outputParameters.get("ReservationPackageId");
        }
		return reservationPackageId;
	}
	
	public void saveMenu(long reservationId, long menuId, int quantity) throws Exception {
		SQLResult<?> sqlResult = SaveRecordWithoutCommit(String.format("INSERT INTO [dbo].[ReservationMenu] ([ReservationId] ,[MenuId], [Quantity]) VALUES (%d,%d,%d)",
				reservationId, menuId, quantity), SQLCommandType.Text);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	public void updateReservation(Reservation model) throws Exception {
		SQLResult<?> sqlResult = SaveRecordWithoutCommit(String.format("UPDATE [dbo].[Reservation] SET AmountPaid = %f, Status = '%s' WHERE ReservationId = %d",
				model.getAmountPaid(), model.getStatus(), model.getReservationId()), SQLCommandType.Text);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	public void saveAppointment(Appointment request) throws Exception {
		AddParameter("ReferenceNo", request.getReferenceNo(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Date", request.getDate(), JDBCType.DATE, ParameterDirection.IN);
		AddParameter("Time", request.getTime(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("UserId", request.getUserId(), JDBCType.BIGINT, ParameterDirection.IN);
		
		SQLResult<?> sqlResult = SaveRecordWithoutCommit("usp_cms_SaveAppointment", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	public void savePayment(Payment request) throws Exception {
		AddParameter("ReservationId", request.getReservationId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("Amount", request.getAmount(), JDBCType.DECIMAL, ParameterDirection.IN);
		AddParameter("FileName", request.getFileName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Attachment", request.getAttachment(), JDBCType.NVARCHAR, ParameterDirection.IN);
		
		SQLResult<?> sqlResult = SaveRecordWithoutCommit("usp_cms_SavePayment", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	public List<Payment> getPayments(long reservationId) throws Exception {
		SQLResult<List<Payment>> sqlResult = SelectRecords(String.format("SELECT * FROM dbo.Payment WHERE ReservationId = %d", reservationId), SQLCommandType.Text, Payment.class);
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public void deletePackage(long reservationId) throws Exception {
		SQLResult<?> sqlResult = SaveRecordWithoutCommit(String.format("DELETE FROM [dbo].[ReservationPackage] WHERE ReservationId = %d", reservationId), SQLCommandType.Text);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	public void deleteMenu(long reservationId) throws Exception {
		SQLResult<?> sqlResult = SaveRecordWithoutCommit(String.format("DELETE FROM [dbo].[ReservationMenu] WHERE ReservationId = %d", reservationId), SQLCommandType.Text);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	public List<Optional> getOptionalsByPackageId(long reservationPackageId) throws Exception {
		SQLResult<List<Optional>> sqlResult = SelectRecords(String.format("SELECT * FROM dbo.Optionals WHERE ReservationPackageId = %d", reservationPackageId), SQLCommandType.Text, Optional.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public void saveOptional(Optional request) throws Exception {
		AddParameter("PackageId", request.getPackageId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("Description", request.getDescription(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Price", request.getPrice(), JDBCType.DECIMAL, ParameterDirection.IN);
		AddParameter("ReservationPackageId", request.getReservationPackageId(), JDBCType.BIGINT, ParameterDirection.IN);
		
		SQLResult<?> sqlResult = SaveRecordWithoutCommit("usp_cms_SaveOptional", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	public void deleteOptional(long reservationPackageId) throws Exception {
		SQLResult<?> sqlResult = SaveRecordWithoutCommit(String.format("DELETE FROM dbo.Optionals WHERE ReservationPackageId = %d", reservationPackageId), SQLCommandType.Text);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}

}
