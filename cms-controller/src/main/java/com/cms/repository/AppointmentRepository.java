package com.cms.repository;

import java.sql.JDBCType;
import java.util.List;

import com.cms.model.Appointment;
import com.cms.model.DataGridRequest;
import com.db.lib.DbWorker;
import com.db.lib.models.ParameterDirection;
import com.db.lib.models.SQLCommandType;
import com.db.lib.models.SQLResult;

public class AppointmentRepository extends DbWorker {

	public AppointmentRepository() throws Exception {
		super();
	}
	
	public List<Appointment> getDataGrid(DataGridRequest<Appointment> request) throws Exception {
		AddParameter("Start", request.getStart(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("Length", request.getLength(), JDBCType.INTEGER, ParameterDirection.IN);
		
		SQLResult<List<Appointment>> sqlResult = SelectRecords("usp_cms_GetDataGridAppointment", SQLCommandType.StoredProcedure, Appointment.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<Appointment> getByUserId(long userId) throws Exception {
		SQLResult<List<Appointment>> sqlResult = SelectRecords(String.format("SELECT * FROM dbo.Appointment WHERE UserId = %d", userId), SQLCommandType.Text, Appointment.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public void save(Appointment request) throws Exception {
		AddParameter("ReferenceNo", request.getReferenceNo(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Date", request.getDate(), JDBCType.DATE, ParameterDirection.IN);
		AddParameter("Time", request.getTime(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("UserId", request.getUserId(), JDBCType.BIGINT, ParameterDirection.IN);
		
		SQLResult<?> sqlResult = SaveRecordAutoCommit("usp_cms_SaveAppointment", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}

}
