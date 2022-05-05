package com.cms.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.model.DataGridRequest;
import com.cms.model.DataGridResponse;
import com.cms.model.HttpResponse;
import com.cms.model.Menu;
import com.cms.model.PackageModel;
import com.cms.model.Reservation;
import com.cms.repository.ReservationRepository;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/reservation")
public class ReservationController {
	
	@PostMapping("/get-data-grid")
	public HttpResponse<DataGridResponse<Reservation>> getDataGridReservationMaster(@RequestBody DataGridRequest<Reservation> request) {
		ReservationRepository repo = null;
		try {
			repo = new ReservationRepository();
			List<Reservation> list = repo.getDataGrid(request);
			for (Reservation item: list) {
				item.setPackages(repo.getPackages(item.getReservationId()));
				item.setMenus(repo.getMenus(item.getReservationId()));
				item.setUser(repo.getUserById(item.getUserId()));
			}
			DataGridResponse<Reservation> dgResponse = new DataGridResponse<Reservation>(list, request.getDraw(), list.size() > 0 ? list.get(0).getTotalRecords() : 0);
			return HttpResponse.success(dgResponse);
		} catch (Exception e) {
			System.out.println(e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			repo.dispose();
		}
	}
	
	@PostMapping("/save")
	public HttpResponse<?> save(@RequestBody Reservation request) {
		ReservationRepository repo = null;
		try {
			repo = new ReservationRepository();
			long reservationId = repo.save(request);
			for (PackageModel item: request.getPackages()) {
				repo.savePackage(reservationId, item.getPackageId());
			}
			for (Menu item: request.getMenus()) {
				repo.saveMenu(reservationId, item.getMenuId(), item.getQuantity());
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
	
	@PostMapping("/get-by-date")
	public HttpResponse<Reservation> getByDate(@RequestBody Reservation request) {
		ReservationRepository repo = null;
		try {
			repo = new ReservationRepository();
			request = repo.getByDate(request.getDate());
			return HttpResponse.success(request);
		} catch (Exception e) {
			System.out.println(e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			repo.dispose();
		}
	}
	
	@GetMapping("/get-by-user/{userId}")
	public HttpResponse<List<Reservation>> getByYear(@PathVariable(value="userId") long userId) {
		ReservationRepository repo = null;
		try {
			repo = new ReservationRepository();
			List<Reservation> result = repo.getAllByUserId(userId);
			for (Reservation item: result) {
				item.setPackages(repo.getPackages(item.getReservationId()));
				item.setMenus(repo.getMenus(item.getReservationId()));
				item.setUser(repo.getUserById(item.getUserId()));
			}
			return HttpResponse.success(result);
		} catch (Exception e) {
			System.out.println(e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			repo.dispose();
		}
	}
	
	@GetMapping("/get-by-year/{year}")
	public HttpResponse<List<Reservation>> getByYear(@PathVariable(value="year") String year) {
		ReservationRepository repo = null;
		try {
			repo = new ReservationRepository();
			List<Reservation> result = repo.getAllByYear(year);
			return HttpResponse.success(result);
		} catch (Exception e) {
			System.out.println(e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			repo.dispose();
		}
	}
	
	@PostMapping("/get-by-reference-no")
	public HttpResponse<Reservation> getByReferenceNo(@RequestBody Reservation request) {
		ReservationRepository repo = null;
		try {
			repo = new ReservationRepository();
			request = repo.getByReferenceNo(request.getReferenceNo());
			request.setPackages(repo.getPackages(request.getReservationId()));
			request.setMenus(repo.getMenus(request.getReservationId()));
			request.setUser(repo.getUserById(request.getUserId()));
			return HttpResponse.success(request);
		} catch (Exception e) {
			System.out.println(e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			repo.dispose();
		}
	}
	
	@PostMapping("/update")
	public HttpResponse<Reservation> update(@RequestBody Reservation request) {
		ReservationRepository repo = null;
		try {
			repo = new ReservationRepository();
			repo.updateReservation(request);
			return HttpResponse.success(request);
		} catch (Exception e) {
			System.out.println(e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			repo.dispose();
		}
	}

}
