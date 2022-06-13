package com.cms.repository;

import java.sql.JDBCType;
import java.util.List;

import com.cms.model.DataGridRequest;
import com.cms.model.Menu;
import com.db.lib.DbWorker;
import com.db.lib.models.ParameterDirection;
import com.db.lib.models.SQLCommandType;
import com.db.lib.models.SQLResult;

public class MenuRepository extends DbWorker {

	public MenuRepository() throws Exception {
		super();
	}
	
	public List<Menu> getDataGrid(DataGridRequest<Menu> request) throws Exception {
		AddParameter("Start", request.getStart(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("Length", request.getLength(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("Name", request.getSearch().getName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Category", request.getSearch().getCategory(), JDBCType.NVARCHAR, ParameterDirection.IN);
		
		SQLResult<List<Menu>> sqlResult = SelectRecords("usp_cms_GetDataGridMenu", SQLCommandType.StoredProcedure, Menu.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<Menu> getAll() throws Exception {
		SQLResult<List<Menu>> sqlResult = SelectRecords("SELECT [MenuId],[Name],[Description],[Category],[Price],[Image],[FileName],[Extension],[IsDeleted] FROM dbo.Menu", SQLCommandType.Text, Menu.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<Menu> getByCategory(String category) throws Exception {
		SQLResult<List<Menu>> sqlResult = SelectRecords(String.format("SELECT [MenuId],[Name],[Description],[Category],[Price],[FileName],[Extension],[IsDeleted] FROM dbo.Menu WHERE [Category] = '%s'", category), SQLCommandType.Text, Menu.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public Menu getById(long id) throws Exception {
		SQLResult<Menu> sqlResult = SelectRecord(String.format("SELECT [MenuId],[Name],[Description],[Category],[Price],[Image],[FileName],[Extension],[IsDeleted] FROM dbo.Menu WHERE MenuId = %d", id), SQLCommandType.Text, Menu.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public void save(Menu request) throws Exception {
		AddParameter("MenuId", request.getMenuId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("Name", request.getName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Description", request.getDescription(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Category", request.getCategory(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Price", request.getPrice(), JDBCType.DECIMAL, ParameterDirection.IN);
		AddParameter("Image", request.getImage(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("FileName", request.getFileName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Extension", request.getExtension(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("IsDeleted", request.isDeleted(), JDBCType.BIT, ParameterDirection.IN);
		
		SQLResult<?> sqlResult = SaveRecordAutoCommit("usp_cms_SaveMenu", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}

}
