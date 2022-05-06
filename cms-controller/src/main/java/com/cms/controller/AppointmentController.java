package com.cms.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.model.Appointment;
import com.cms.model.DataGridRequest;
import com.cms.model.DataGridResponse;
import com.cms.model.HttpResponse;
import com.cms.model.Reservation;
import com.cms.repository.AppointmentRepository;
import com.cms.repository.ReservationRepository;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/appointment")
public class AppointmentController {
	
	@PostMapping("/get-data-grid")
	public HttpResponse<DataGridResponse<Appointment>> getDataGrid(@RequestBody DataGridRequest<Appointment> request) {
		AppointmentRepository aRepo = null;
		ReservationRepository rRepo = null;
		try {
			aRepo = new AppointmentRepository();
			rRepo = new ReservationRepository();
			List<Appointment> list = aRepo.getDataGrid(request);
			for (Appointment item: list) {
				item.setReservation(rRepo.getByReferenceNo(item.getReferenceNo()));
				item.getReservation().setPackages(rRepo.getPackages(item.getReservation().getReservationId()));
				item.getReservation().setMenus(rRepo.getMenus(item.getReservation().getReservationId()));
				item.setUser(rRepo.getUserById(item.getUserId()));
			}
			DataGridResponse<Appointment> dgResponse = new DataGridResponse<Appointment>(list, request.getDraw(), list.size() > 0 ? list.get(0).getTotalRecords() : 0);
			return HttpResponse.success(dgResponse);
		} catch (Exception e) {
			System.out.println(e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			aRepo.dispose();
			rRepo.dispose();
		}
	}
	
	@PostMapping("/save")
	public HttpResponse<?> save(@RequestBody Appointment request) {
		AppointmentRepository repo = null;
		ReservationRepository rRepo = null;
		try {
			repo = new AppointmentRepository();
			rRepo = new ReservationRepository();
			Reservation model = rRepo.getByReferenceNoAndUser(request.getReferenceNo(), request.getUserId());
			if (model == null || model.getReservationId() <= 0) {
				return HttpResponse.failed("Invalid Reference No.");
			}
			repo.save(request);
			return HttpResponse.success();
		} catch (Exception e) {
			System.out.println(e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			repo.dispose();
			rRepo.dispose();
		}
	}
	
	@GetMapping("/get-by-user/{userId}")
	public HttpResponse<List<Appointment>> getByUserId(@PathVariable(value="userId") long userId) {
		AppointmentRepository aRepo = null;
		ReservationRepository rRepo = null;
		try {
			aRepo = new AppointmentRepository();
			rRepo = new ReservationRepository();
			List<Appointment> list = aRepo.getByUserId(userId);
			for (Appointment item: list) {
				item.setReservation(rRepo.getByReferenceNo(item.getReferenceNo()));
				item.getReservation().setPackages(rRepo.getPackages(item.getReservation().getReservationId()));
				item.getReservation().setMenus(rRepo.getMenus(item.getReservation().getReservationId()));
				item.setUser(rRepo.getUserById(item.getUserId()));
			}
			return HttpResponse.success(list);
		} catch (Exception e) {
			System.out.println(e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			aRepo.dispose();
			rRepo.dispose();
		}
	}

}
