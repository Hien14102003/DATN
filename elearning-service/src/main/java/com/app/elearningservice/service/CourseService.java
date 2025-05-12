package com.app.elearningservice.service;

import com.app.elearningservice.dto.CourseDetailDTO;
import com.app.elearningservice.dto.EnrollCourseDTO;
import com.app.elearningservice.dto.QuizzDTO;
import com.app.elearningservice.exception.AppException;
import com.app.elearningservice.model.Course;
import com.app.elearningservice.model.LevelCourse;
import com.app.elearningservice.model.PagingContainer;
import com.app.elearningservice.model.User;
import com.app.elearningservice.payload.CoursePayload;
import com.app.elearningservice.response.QuizDetailResponse;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CourseService {
    private final NamedParameterJdbcTemplate writeDb;
    private final QuizzService quizzService;

    public CourseService(NamedParameterJdbcTemplate writeDb, QuizzService quizzService) {
        this.writeDb = writeDb;
        this.quizzService = quizzService;
    }

    public QuizDetailResponse review(long quizId) {
        return quiz(quizId, true);
    }

    public List<LevelCourse> allLevels() {
        return writeDb.query("SELECT * FROM levels", BeanPropertyRowMapper.newInstance(LevelCourse.class));
    }

    public QuizDetailResponse quiz(long quizId) {
        return quiz(quizId, false);
    }

    public QuizDetailResponse quiz(long quizId, boolean isReview) {
        var quiz = writeDb.queryForObject(
                """
                        select *
                        from quizzes q
                        where q.quiz_id = :quizId;
                        """,
                Map.of("quizId", quizId),
                BeanPropertyRowMapper.newInstance(QuizzDTO.class)
        );
        return new QuizDetailResponse(quiz, isReview
                ? quizzService.findQuestionsWithAnswerByQuizzId(quizId)
                : quizzService.findQuestionsByQuizzId(quizId)
        );
    }

    public List<QuizzDTO> quizzes(long courseId) {
        var sql = """
                select q.quiz_id,
                        q.title,
                       (select count(1) from questions q2 where q2.quiz_id = q.quiz_id and q2.status = 'active') as numberOfQuestion
                from courses c
                         inner join lessons l on c.course_id = l.course_id and l.status = 'active'
                         inner join quizzes q on l.lesson_id = q.lesson_id and q.status = 'active'
                where c.course_id = :course_id
                """;
        return writeDb.query(sql, Map.of("course_id", courseId), BeanPropertyRowMapper.newInstance(QuizzDTO.class));
    }

    public List<String> student(long courseId) {
        return writeDb.queryForList(
                """
                        SELECT concat('Email: ', u.email, ' - Name: ', u.first_name, ' ', u.last_name) AS user_info
                        FROM enrollments e
                                 INNER JOIN users u ON e.user_id = u.user_id
                        WHERE e.course_id = :courseId;
                        """,
                Map.of("courseId", courseId),
                String.class
        );
    }

    public Course findById(Long courseId) {
        return writeDb.queryForObject(
                "SELECT * FROM courses WHERE course_id = :courseId",
                Map.of("courseId", courseId),
                BeanPropertyRowMapper.newInstance(Course.class)
        );
    }

    public List<EnrollCourseDTO> myCourse(Long userId) {
        var sql = """
                select c.name                                        as course_name,
                       c.thumbnail,
                       c.start_date,
                       c.end_date,
                       e.created_at                                  as enrollment_date,
                       e.status                                      as enrollment_status,
                       IF(c.end_date < now(), 'completed', 'active') as course_status
                from courses c
                         inner join enrollments e on c.course_id = e.course_id
                where e.user_id = :user_id
                order by e.created_at
                """;
        return writeDb.query(sql, Map.of("user_id", userId), BeanPropertyRowMapper.newInstance(EnrollCourseDTO.class));
    }

    public Course detail(long courseId, User user) {
        var sql = """
                with course_user as (select c.course_id,
                                      c.name        as course_name,
                                      c.description as course_description,
                                      c.thumbnail,
                                      c.start_date,
                                      c.end_date,
                                      lv.name       as level_name,
                                      l.lesson_id,
                                      l.title       as lesson_name,
                                      l.description as lesson_description,
                                      m.media_id,
                                      m.type        as media_type,
                                      m.url         as media_url,
                                      m.title       as media_title,
                                      m.url_blob
                               from courses c
                                        inner join levels lv on c.level_id = lv.level_id
                                        left join lessons l on c.course_id = l.course_id and l.status = 'active'
                                        left join media m on l.lesson_id = m.lesson_id
                               where true
                                 and c.status = 'active'
                                 and c.course_id = :course_id),
                is_join as (select CASE c.status
                                      WHEN 'pending' THEN 0
                                      WHEN 'approved' THEN 1
                                      ELSE 2
                                      END as is_join
                           from enrollments c
                           where c.course_id = :course_id
                             and c.user_id = :user_id
                             order by c.created_at desc
                              limit 1)
                select c.course_id          as aboutId,
                 c.course_description as content,
                 c.course_name,
                 c.thumbnail,
                 c.start_date,
                 c.end_date,
                 c.level_name,
                 c.lesson_id,
                 c.lesson_name,
                 c.lesson_description,
                 c.media_id,
                 c.media_type,
                 c.media_url,
                 c.media_title,
                c.url_blob,
                 IFNULL(i.is_join, 2) as is_join
                from course_user c
                   left join is_join i on true;
                """;
        var param = Map.of("course_id", courseId, "user_id", Optional.ofNullable(user).map(User::getUserId).orElse(0L));
        var result = writeDb.query(sql, param, BeanPropertyRowMapper.newInstance(CourseDetailDTO.class));
        return new Course(result);
    }

    @Transactional
    public void delete(long courseId) {
        writeDb.update(
                "update courses set status = 'inactive' where course_id = :courseId",
                Map.of("courseId", courseId)
        );
    }

    @Transactional
    public void save(CoursePayload payload, String thumbnail) {
        if (existsName(payload.getName(), payload.getCourseId())) {
            throw new AppException("400", "Course name already exists");
        }
        var param = new MapSqlParameterSource()
                .addValue("name", payload.getName())
                .addValue("description", payload.getDescription())
                .addValue("level_id", payload.getLevelId())
                .addValue("start_date", payload.getStartDate())
                .addValue("end_date", payload.getEndDate())
                .addValue("thumbnail", thumbnail);
        if (payload.getCourseId() > 0) {
            param.addValue("course_id", payload.getCourseId());
            writeDb.update("""
                                   update courses
                                   set name        = IFNULL(:name, name),
                                       description = IFNULL(:description, description),
                                       start_date  = IFNULL(:start_date, start_date),
                                       end_date    = IFNULL(:end_date, end_date),
                                       thumbnail   = IFNULL(:thumbnail, thumbnail),
                                       level_id    = IFNULL(:level_id, level_id)
                                   where course_id = :course_id;
                                   """, param);
        } else {
            writeDb.update("""
                                   insert into courses(name, description, level_id, thumbnail, start_date, end_date) 
                                   VALUES (:name, :description, :level_id, :thumbnail, :start_date, :end_date);
                                   """, param);
        }
    }

    public List<Course> findPopular() {
        return writeDb.query(
                """
                        select c.course_id,
                               c.name,
                               c.description,
                               l.level_id,
                               l.name as level_name,
                               c.thumbnail,
                               c.status,
                               c.start_date,
                               c.end_date,
                               c.number_of_students
                        from courses c
                                 inner join levels l on c.level_id = l.level_id
                        where true
                            and c.status = 'active'
                        order by c.number_of_students desc
                        limit 10;
                        """,
                (rs, i) -> new Course(rs)
        );
    }

    public PagingContainer<Course> findAll(int page, int size, String key) {
        var sql = """
                select c.course_id,
                       c.name,
                       c.description,
                       l.level_id,
                       l.name as level_name,
                       c.thumbnail,
                       c.status,
                       c.start_date,
                       c.end_date,
                       c.number_of_students
                from courses c
                         inner join levels l on c.level_id = l.level_id
                where true
                    and c.status = 'active'
                    and c.name like :key;
                """;
        var param = Map.of("key", "%" + key + "%");
        var data = writeDb.query(sql, param, (rs, i) -> new Course(rs));
        var sqlCount = """
                SELECT COUNT(1) FROM courses WHERE status = 'active' and name like :key;
                """;
        var total = writeDb.queryForObject(sqlCount, param, Integer.class);
        return new PagingContainer<>(page, size, total, data);
    }

    public boolean existsName(String name, long courseId) {
        String sql = "SELECT EXISTS(SELECT 1 FROM courses WHERE name = :name AND status = 'active' and course_id <> :courseId);";
        var param = new MapSqlParameterSource().addValue("name", name).addValue("courseId", courseId);
        return writeDb.queryForObject(sql, param, Boolean.class);
    }

}
