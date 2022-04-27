package com.cms.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.model.DataGridRequest;
import com.cms.model.DataGridResponse;
import com.cms.model.HttpResponse;
import com.cms.model.PackageModel;
import com.cms.repository.PackageRepository;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/package")
public class PackageController {

	@PostMapping("/get-data-grid")
	public HttpResponse<DataGridResponse<PackageModel>> getDataGridRoomMaster(@RequestBody DataGridRequest<PackageModel> request) {
		PackageRepository repo = null;
		try {
			repo = new PackageRepository();
			List<PackageModel> list = repo.getDataGrid(request);
			DataGridResponse<PackageModel> dgResponse = new DataGridResponse<PackageModel>(list, request.getDraw(), list.size() > 0 ? list.get(0).getTotalRecords() : 0);
			return HttpResponse.success(dgResponse);
		} catch (Exception e) {
			System.out.println(e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			repo.dispose();
		}
	}
	
	@GetMapping("/get-all")
	public HttpResponse<List<PackageModel>> getAll() {
		PackageRepository repo = null;
		try {
			repo = new PackageRepository();
			return HttpResponse.success(repo.getAll());
		} catch (Exception e) {
			System.out.println(e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			repo.dispose();
		}
	}
	
	@PostMapping("/save")
	public HttpResponse<DataGridResponse<PackageModel>> save(@RequestBody PackageModel request) {
		PackageRepository repo = null;
		try {
			repo = new PackageRepository();
			repo.save(request);
			return HttpResponse.success();
		} catch (Exception e) {
			System.out.println(e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			repo.dispose();
		}
	}
}
