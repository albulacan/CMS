package com.cms.repository;

import java.sql.Date;
import java.sql.JDBCType;
import java.util.List;

import com.cms.model.DataGridRequest;
import com.cms.model.Menu;
import com.cms.model.PackageModel;
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
		SQLResult<List<Reservation>> sqlResult = SelectRecords(String.format("SELECT * FROM dbo.Reservation WHERE UserId = %d", userId), SQLCommandType.Text, Reservation.class);
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<Reservation> getAllByYear(String year) throws Exception {
		SQLResult<List<Reservation>> sqlResult = SelectRecords(String.format("SELECT MAX(CreatedOn) CreatedOn, SUM(AmountDue) AmountDue FROM dbo.Reservation WHERE DATEPART(YEAR, CreatedOn) = '%s' GROUP BY DATEADD(MONTH, DATEDIFF(MONTH, 0, CreatedOn), 0)", year), SQLCommandType.Text, Reservation.class);
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
	
	public Reservation getByReferenceNo(String referenceNo) throws Exception {
		SQLResult<Reservation> sqlResult = SelectRecord(String.format("SELECT * FROM dbo.[Reservation] WHERE ReferenceNo = '%s'", referenceNo), SQLCommandType.Text, Reservation.class);
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
		AddParameter("AmountDue", request.getAmountDue(), JDBCType.DECIMAL, ParameterDirection.IN);
		AddParameter("AmountPaid", request.getAmountPaid(), JDBCType.DECIMAL, ParameterDirection.IN);
		AddParameter("Status", request.getStatus(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("ReservationId", JDBCType.BIGINT, ParameterDirection.OUT);
		
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
	
	public void savePackage(long reservationId, long packageId) throws Exception {
		SQLResult<?> sqlResult = SaveRecordWithoutCommit(String.format("INSERT INTO [dbo].[ReservationPackage] ([ReservationId] ,[PackageId]) VALUES (%d,%d)",
				reservationId, packageId), SQLCommandType.Text);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	public void saveMenu(long reservationId, long menuId, int quantity) throws Exception {
		SQLResult<?> sqlResult = SaveRecordWithoutCommit(String.format("INSERT INTO [dbo].[ReservationMenu] ([ReservationId] ,[MenuId], [Quantity]) VALUES (%d,%d,%d)",
				reservationId, menuId, quantity), SQLCommandType.Text);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	public void updateReservation(Reservation model) throws Exception {
		SQLResult<?> sqlResult = SaveRecordAutoCommit(String.format("UPDATE [dbo].[Reservation] SET AmountPaid = %f, Status = '%s' WHERE ReservationId = %d",
				model.getAmountPaid(), model.getStatus(), model.getReservationId()), SQLCommandType.Text);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}

}
