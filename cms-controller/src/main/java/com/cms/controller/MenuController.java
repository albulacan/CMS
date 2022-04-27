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
import com.cms.model.Menu;
import com.cms.repository.MenuRepository;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/menu")
public class MenuController {

	@PostMapping("/get-data-grid")
	public HttpResponse<DataGridResponse<Menu>> getDataGridRoomMaster(@RequestBody DataGridRequest<Menu> request) {
		MenuRepository repo = null;
		try {
			repo = new MenuRepository();
			List<Menu> list = repo.getDataGrid(request);
			DataGridResponse<Menu> dgResponse = new DataGridResponse<Menu>(list, request.getDraw(), list.size() > 0 ? list.get(0).getTotalRecords() : 0);
			return HttpResponse.success(dgResponse);
		} catch (Exception e) {
			System.out.println(e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			repo.dispose();
		}
	}
	
	@GetMapping("/get-all")
	public HttpResponse<List<Menu>> getAll() {
		MenuRepository repo = null;
		try {
			repo = new MenuRepository();
			return HttpResponse.success(repo.getAll());
		} catch (Exception e) {
			System.out.println(e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			repo.dispose();
		}
	}
	
	@PostMapping("/save")
	public HttpResponse<DataGridResponse<Menu>> save(@RequestBody Menu request) {
		MenuRepository repo = null;
		try {
			repo = new MenuRepository();
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
