package com.ou.autorepairshop.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {
    private String secret = "chi-mot-dem-nua-hoi-la-2-dem-roi";
    private  Long accessTokenExpiresMs = 900_00L;
    private Long refreshTokenExpiresToken = 864_000_00L;

}
