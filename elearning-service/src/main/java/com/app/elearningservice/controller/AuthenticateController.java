package com.app.elearningservice.controller;

import com.app.elearningservice.exception.AppException;
import com.app.elearningservice.model.ResponseContainer;
import com.app.elearningservice.payload.LoginPayload;
import com.app.elearningservice.payload.OtpVerifyPayload;
import com.app.elearningservice.payload.RegisterPayload;
import com.app.elearningservice.service.EmailService;
import com.app.elearningservice.service.OtpService;
import com.app.elearningservice.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.java.Log;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Level;

@Log
@RestController
@RequestMapping("/auth")
public class AuthenticateController {
    private final UserService authService;
    private final EmailService emailService;
    private final OtpService otpService;

    public AuthenticateController(
            UserService authService, EmailService emailService, OtpService otpService
    ) {
        this.authService = authService;
        this.emailService = emailService;
        this.otpService = otpService;
    }

    @GetMapping("t")
    public Object t() {
        var email = "@gmail.com";
        try {
            emailService.send("test", "kira", email);
        } catch (Exception ex) {
            log.log(Level.WARNING,"Kira", ex);
        }
        return ResponseContainer.success("ok");
    }

    @PostMapping("login")
    public Object login(
            @Valid @RequestBody LoginPayload payload
    ) {
        return ResponseContainer.success(authService.authenticate(payload.email(), payload.password()));
    }

    @PostMapping("register")
    public Object register(@Valid @RequestBody RegisterPayload payload) {
        try {
            if (authService.validateEmailExist(payload.email())) {
                return ResponseContainer.failure("Email already exists");
            }
            authService.register(payload);
            return ResponseContainer.success("Register successfully");
        } catch (Exception e) {
            return ResponseContainer.failure(e.getMessage());
        }
    }

    @PostMapping("otp-resend")
    public Object resendOtp(@RequestBody String email) {
        try {
            emailService.sendEmailOtp(email);
            return ResponseContainer.success("Send OTP successfully");
        } catch (Exception e) {
            return ResponseContainer.failure(e.getMessage());
        }
    }

    @PostMapping("forget-password")
    public Object forgetPassword(@RequestBody String email) {
        try {
            var newPassword = authService.randomPassword();
            var user = authService.findByEmail(email).orElseThrow(() -> new AppException("400", "Email not found"));
            var content = String.format("Your new password is: %s", newPassword);
            emailService.send("Forget password", content, email);
            authService.updatePassword(user.getUserId(), newPassword);
            return ResponseContainer.success("New password has been sent to your email");
        } catch (Exception e) {
            log.log(Level.WARNING, "Error while sending email", e);
            return ResponseContainer.failure(e.getMessage());
        }
    }

    @PostMapping("otp-verify")
    public Object verifyOtp(@RequestBody OtpVerifyPayload payload) {
        var otp = otpService.getOtp(payload.email());
        if (otp.isEmpty() || otp.get().isNotCorrect(payload.otp())) {
            return ResponseContainer.failure("Invalid OTP");
        }
        if (otp.get().isExpired()) {
            return ResponseContainer.failure("OTP is expired");
        }
        otpService.deleteOtp(payload.email());
        authService.activeUser(payload.email());
        return ResponseContainer.success("OTP is correct");
    }
}
