package com.app.elearningservice.service;

import com.app.elearningservice.model.Otp;
import lombok.extern.java.Log;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Date;
import java.util.Optional;
import java.util.Random;

@Log
@Service
public class OtpService {
    private static final int EXPIRE_MINUTES = 1; // 30 minutes
    private final NamedParameterJdbcTemplate writeDb;
    private final Random random = new Random();

    public OtpService(NamedParameterJdbcTemplate writeDb) {
        this.writeDb = writeDb;
    }


    @Transactional
    public String generateOtp(String email) {
        var newOtp = generateOTP();
        var expiredAt = new Date(System.currentTimeMillis() + Duration.ofMinutes(EXPIRE_MINUTES).toMillis());
        var otp = new Otp(0, email, newOtp, expiredAt.getTime(), new Date());
        save(otp);
        return newOtp;
    }

    public boolean verifyOtp(String email, String otp) {
        return findByEmail(email)
                .filter(o -> o.isValid(otp))
                .isPresent();
    }

    public Optional<Otp> getOtp(String email) {
        return findByEmail(email);
    }


    public void deleteOtp(String email) {
        deleteByEmail(email);
    }

    private String generateOTP() {
        int length = 6;
        String numbers = "0123456789";
        char[] otp = new char[length];
        for (int i = 0; i < length; i++) {
            otp[i] = numbers.charAt(random.nextInt(numbers.length()));
        }
        return new String(otp);
    }

    @Transactional
    public void save(Otp otp) {
        var sql = "CALL up_SaveOTP(:email, :otp, :expireTime)";
        var params = new MapSqlParameterSource()
                .addValue("email", otp.email())
                .addValue("otp", otp.otp())
                .addValue("expireTime", otp.expiredAt());
        writeDb.update(sql, params);
    }

    public Optional<Otp> findByEmail(String email) {
        var sql = "SELECT * FROM otp WHERE email = :email";
        var params = new MapSqlParameterSource().addValue("email", email);
        return writeDb.query(sql, params, (rs, i) -> new Otp(rs)).stream().findFirst();
    }

    @Transactional
    public void deleteByEmail(String email) {
        var sql = "DELETE FROM otp WHERE email = :email";
        var params = new MapSqlParameterSource().addValue("email", email);
        writeDb.update(sql, params);
    }
}
