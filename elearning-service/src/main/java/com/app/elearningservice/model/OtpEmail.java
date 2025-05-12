package com.app.elearningservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class OtpEmail {
    private String email;
    private String otpNo;
}
