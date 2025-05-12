package com.app.elearningservice.controller;

import com.app.elearningservice.jwt.JwtTokenProvider;
import com.app.elearningservice.model.ResponseContainer;
import com.app.elearningservice.model.User;
import com.app.elearningservice.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("student/course")
@RequiredArgsConstructor
public class CourseV2Controller {
    private final CourseService courseService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("gen")
    public Object gen() {
        return ResponseContainer.success(jwtTokenProvider.generateToken("hien@gmail.com", "1234qwer", List.of()));
    }

    @GetMapping
    public Object findAll(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size,
            @RequestParam(value = "key", defaultValue = "") String key
    ) {
        return ResponseContainer.success(courseService.findAll(page, size, key));
    }

    @GetMapping("popular")
    public Object findPopular() {
        return ResponseContainer.success(courseService.findPopular());
    }

    @GetMapping("{courseId}")
    public Object detail(@PathVariable(value = "courseId") Long courseId, @AuthenticationPrincipal User user) {
        return ResponseContainer.success(courseService.detail(courseId, user));
    }

    @GetMapping("{courseId}/student")
    public Object student(@PathVariable(value = "courseId") Long courseId) {
        return ResponseContainer.success(courseService.student(courseId));
    }

    @GetMapping("{courseId}/quizzes")
    public Object quizzes(@PathVariable(value = "courseId") Long courseId) {
        return ResponseContainer.success(courseService.quizzes(courseId));
    }

    @GetMapping("quiz/{quizId}")
    public Object quiz(@PathVariable(value = "quizId") Long quizId) {
        return ResponseContainer.success(courseService.quiz(quizId));
    }

    @GetMapping("review/{quizId}")
    public Object review(@PathVariable(value = "quizId") Long quizId) {
        return ResponseContainer.success(courseService.review(quizId));
    }

    @GetMapping("my-course")
    public Object myCourse(@AuthenticationPrincipal User user) {
        return ResponseContainer.success(courseService.myCourse(user.getUserId()));
    }
}
