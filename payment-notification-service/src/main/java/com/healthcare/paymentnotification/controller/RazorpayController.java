package com.healthcare.paymentnotification.controller;

import com.healthcare.paymentnotification.dto.RazorpayOrderRequest;
import com.healthcare.paymentnotification.dto.RazorpayOrderResponse;
import com.healthcare.paymentnotification.service.RazorpayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/razorpay")
@RequiredArgsConstructor
public class RazorpayController {

    private final RazorpayService razorpayService;

    @PostMapping("/create-order")
    public ResponseEntity<RazorpayOrderResponse> createOrder(@RequestBody RazorpayOrderRequest request) {
        RazorpayOrderResponse response = razorpayService.createOrder(request);
        return ResponseEntity.ok(response);
    }
}
