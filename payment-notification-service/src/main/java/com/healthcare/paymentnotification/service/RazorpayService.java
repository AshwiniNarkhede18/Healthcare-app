package com.healthcare.paymentnotification.service;

import com.healthcare.paymentnotification.dto.RazorpayOrderRequest;
import com.healthcare.paymentnotification.dto.RazorpayOrderResponse;

public interface RazorpayService {
    RazorpayOrderResponse createOrder(RazorpayOrderRequest request);
}
