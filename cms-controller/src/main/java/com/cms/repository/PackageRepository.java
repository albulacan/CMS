package com.cms.repository;

import java.sql.JDBCType;
import java.util.List;

import com.cms.model.DataGridRequest;
import com.cms.model.Optional;
import com.cms.model.PackageModel;
import com.db.lib.DbWorker;
import com.db.lib.models.ParameterDirection;
import com.db.lib.models.SQLCommandType;
import com.db.lib.models.SQLResult;

public class PackageRepository extends DbWorker {

	public PackageRepository() throws Exception {
		super();
	}
	
	public List<PackageModel> getDataGrid(DataGridRequest<PackageModel> request) throws Exception {
		AddParameter("Start", request.getStart(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("Length", request.getLength(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("Name", request.getSearch().getName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		
		SQLResult<List<PackageModel>> sqlResult = SelectRecords("usp_cms_GetDataGridPackage", SQLCommandType.StoredProcedure, PackageModel.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<PackageModel> getAll() throws Exception {
		SQLResult<List<PackageModel>> sqlResult = SelectRecords("SELECT * FROM dbo.Package", SQLCommandType.Text, PackageModel.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<Optional> getOptionalsByPackageId(long packageId) throws Exception {
		SQLResult<List<Optional>> sqlResult = SelectRecords(String.format("SELECT * FROM dbo.Optionals WHERE PackageId = %d AND ReservationPackageId = 0", packageId), SQLCommandType.Text, Optional.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public long save(PackageModel request) throws Exception {
		AddParameter("PackageId", request.getPackageId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("Name", request.getName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Description", request.getDescription(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Pax", request.getPax(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("Menu", request.getMenu(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("AddsOn", request.getAddsOn(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Price", request.getPrice(), JDBCType.DECIMAL, ParameterDirection.IN);
		AddParameter("IsDeleted", request.isDeleted(), JDBCType.BIT, ParameterDirection.IN);
		AddParameter("OutPackageId", JDBCType.BIGINT, ParameterDirection.OUT);
		
		SQLResult<?> sqlResult = SaveRecordWithoutCommit("usp_cms_SavePackage", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		
		long packageId = 0;
		if (outputParameters.size() > 0) {
			packageId = (Long) outputParameters.get("OutPackageId");
        }
		return packageId;
	}
	
	public void saveOptional(Optional request) throws Exception {
		AddParameter("PackageId", request.getPackageId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("Description", request.getDescription(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Price", request.getPrice(), JDBCType.DECIMAL, ParameterDirection.IN);
		AddParameter("ReservationPackageId", 0, JDBCType.BIGINT, ParameterDirection.IN);
		
		SQLResult<?> sqlResult = SaveRecordWithoutCommit("usp_cms_SaveOptional", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	public void deleteOptional(long packageId) throws Exception {
		SQLResult<?> sqlResult = SaveRecordWithoutCommit(String.format("DELETE FROM dbo.Optionals WHERE PackageId = %d AND ReservationPackageId = 0", packageId), SQLCommandType.Text);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}

}
