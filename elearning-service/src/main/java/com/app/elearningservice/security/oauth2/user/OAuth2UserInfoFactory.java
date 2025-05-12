package com.app.elearningservice.security.oauth2.user;


import com.app.elearningservice.exception.AppException;
import com.app.elearningservice.model.enums.ErrorCodeEnum;
import com.app.elearningservice.utils.Constants;

import java.util.Map;

public class OAuth2UserInfoFactory {
    public static OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        if (Constants.GOOGLE.equalsIgnoreCase(registrationId)) {
            return new GoogleOAuth2UserInfo(attributes);
        } else if (Constants.FACEBOOK.equalsIgnoreCase(registrationId)) {
            return new FacebookOAuth2UserInfo(attributes);
        } else {
            throw new AppException(ErrorCodeEnum.UN_AUTHORIZATION);
        }
    }
}
