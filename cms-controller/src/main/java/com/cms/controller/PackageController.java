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
import com.cms.model.Optional;
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
			for (PackageModel item: dgResponse.getData()) {
				item.setOptionals(repo.getOptionalsByPackageId(item.getPackageId()));
			}
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
			List<PackageModel> data = repo.getAll();
			for (PackageModel item: data) {
				item.setOptionals(repo.getOptionalsByPackageId(item.getPackageId()));
			}
			return HttpResponse.success(data);
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
			long packageId = repo.save(request);
			repo.deleteOptional(packageId);
			for (Optional item: request.getOptionals()) {
				item.setPackageId(packageId);
				repo.saveOptional(item);
			}
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
