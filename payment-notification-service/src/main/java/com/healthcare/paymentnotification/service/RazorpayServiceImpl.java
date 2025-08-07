package com.healthcare.paymentnotification.service;

import com.healthcare.paymentnotification.dto.RazorpayOrderRequest;
import com.healthcare.paymentnotification.dto.RazorpayOrderResponse;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RazorpayServiceImpl implements RazorpayService {

    @Value("${razorpay.key_id}")
    private String keyId;

    @Value("${razorpay.key_secret}")
    private String keySecret;

    @Override
    public RazorpayOrderResponse createOrder(RazorpayOrderRequest request) {
        try {
            RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

            JSONObject options = new JSONObject();
            options.put("amount", request.getAmount().multiply(java.math.BigDecimal.valueOf(100)).intValue()); // amount in paise
            options.put("currency", request.getCurrency());
            options.put("receipt", request.getReceipt());
            options.put("payment_capture", true);

            Order order = razorpay.orders.create(options);

            return RazorpayOrderResponse.builder()
                    .id(order.get("id"))
                    .currency(order.get("currency"))
                    .amount(order.get("amount"))
                    .status(order.get("status"))
                    .build();

        } catch (Exception e) {
            log.error("Razorpay order creation failed", e);
            throw new RuntimeException("Failed to create Razorpay order", e);
        }
    }
}
