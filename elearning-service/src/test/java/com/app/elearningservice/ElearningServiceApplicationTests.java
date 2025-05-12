package com.app.elearningservice;

import com.app.elearningservice.payload.LoginPayload;
import com.app.elearningservice.payload.RegisterPayload;
import com.app.elearningservice.utils.JsonConverter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ElearningServiceApplicationTests {

    @Autowired
    private MockMvc mockMvc;
    private static final String TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOi213JoaWRlb25idXNoODQwNSt0ZXN0MTFAZ21haWwuY29tIiwicm9sZSI6WyJTVFVERU5UIl0sInBhc3N3b3JkIjoiJDJhJDEwJG9LLjdjbktNWHZYMzdRSktGR0NDQS5zTzZTUEVTcEZqWm9VbWVzV015L1pkbUFVMnBkRVppIiwiaWF0IjoxNzQ0NTI5OTY1LCJleHAiOjE3NDQ2MTYzNjV9.XCKMvmcpdU9PA89fJ8okckOKXJ6lN-8k-jV7ZPsVY_0";

    @Test
    void loginTestSuccess() throws Exception {
        LoginPayload payload = new LoginPayload("admin@gmail.com", "1234qwer");

        mockMvc.perform(post("/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(JsonConverter.convertObjectToJson(payload)))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void loginTestFail() throws Exception {
        LoginPayload payload = new LoginPayload("admin@gmail.com", "asd");

        mockMvc.perform(post("/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(JsonConverter.convertObjectToJson(payload)))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.success").value(false))
               .andExpect(jsonPath("$.message").value("Password must be at least 6 character"));
    }

    @Test
    void registerTestSuccess() throws Exception {
        var suffixChar = System.currentTimeMillis() % 10000;
        var email = "hien" + suffixChar + "@gmail.com";
        RegisterPayload payload = new RegisterPayload(email, "1234qwer", "Hien", "Tran");
        mockMvc.perform(post("/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(JsonConverter.convertObjectToJson(payload)))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void registerTestExistEmail() throws Exception {
        RegisterPayload payload = new RegisterPayload("admin@gmail.com", "1234qwer", "Hien", "Tran");
        mockMvc.perform(post("/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(JsonConverter.convertObjectToJson(payload)))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void listCourseTest() throws Exception {
        mockMvc.perform(get("/student/course")
                                .contentType(MediaType.APPLICATION_JSON))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void resultTest() throws Exception {
        mockMvc.perform(get("/user/result")
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", TOKEN))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void quizTest() throws Exception {
        mockMvc.perform(get("/student/course/quiz/4")
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", TOKEN))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void reviewTest() throws Exception {
        mockMvc.perform(get("/student/course/review/4")
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", TOKEN))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void myCourseTest() throws Exception {
        mockMvc.perform(get("/student/course/my-course")
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", TOKEN))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void detailCourseTest() throws Exception {
        mockMvc.perform(get("/student/course/1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", TOKEN))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void quizListOfCourseTest() throws Exception {
        mockMvc.perform(get("/student/course/1/quizzes")
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", TOKEN))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.success").value(true));
    }
}
