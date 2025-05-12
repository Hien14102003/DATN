package com.app.elearningservice.controller;

import com.app.elearningservice.dto.DashboardDTO;
import com.app.elearningservice.model.ChartData;
import com.app.elearningservice.model.Datasets;
import com.app.elearningservice.model.ResponseContainer;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("dashboard")
public class HomeController {
    private final NamedParameterJdbcTemplate writeDb;

    public HomeController(NamedParameterJdbcTemplate writeDb) {
        this.writeDb = writeDb;
    }

    @GetMapping
    public Object getDashboard() {
        return ResponseContainer.success(getDashboardData());
    }

    private DashboardDTO getDashboardData() {
        var sql = """
                with countCourse as (select count(1) as course_count
                                     from courses
                                     where status = 'active'),
                     countStudent as (select count(1) as student_count
                                      from users
                                      where status = 'active'
                                        and role = 'student'),
                     countQuiz as (select count(1) as quiz_count
                                   from quizzes
                                   where status = 'active'),
                     countLesson as (select count(1) as lesson_count
                                     from lessons
                                     where status = 'active')
                select *
                from countCourse,
                     countStudent,
                     countQuiz,
                     countLesson
                """;

        return writeDb.query(sql, Map.of(), (res, i) -> new DashboardDTO(res))
                      .stream()
                      .findFirst()
                      .orElse(new DashboardDTO());
    }

    @GetMapping("chart")
    public Object chart() {
        var data = getDashboardData();
        var labels = List.of("Courses", "Students", "Quizzes", "Lessons");
        var datasets = List.of(
                new Datasets(List.of(data.getTotalCourses(), 0, 0, 0), "Courses"),
                new Datasets(List.of(0, data.getTotalStudent(), 0, 0), "Students"),
                new Datasets(List.of(0, 0, data.getTotalQuiz(), 0), "Quizzes"),
                new Datasets(List.of(0, 0, 0, data.getTotalLesson()), "Lessons")
        );
        return ResponseContainer.success(new ChartData(labels, datasets));
    }
}
