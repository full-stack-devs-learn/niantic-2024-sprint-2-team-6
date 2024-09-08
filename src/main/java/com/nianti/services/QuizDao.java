package com.nianti.services;

import com.nianti.models.Quiz;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.List;

@Component
public class QuizDao
{
    private JdbcTemplate jdbcTemplate;

    @Autowired
    public QuizDao(DataSource dataSource)
    {
        jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public List<Quiz> getAllQuizzes()
    {
        ArrayList<Quiz> quizzes = new ArrayList<>();
        String sql = """
            SELECT quiz_id
                , quiz_title
                , is_live
                , quiz_description
                FROM quiz;
            """;
        var row = jdbcTemplate.queryForRowSet(sql);
        while (row.next())
        {
            var quiz = mapRowToQuiz(row);
            quizzes.add(quiz);
        }

        return quizzes;
    }

    private Quiz mapRowToQuiz(SqlRowSet row)
    {
        int id = row.getInt("quiz_id");
        String title = row.getString("quiz_title");
        boolean isLive = row.getBoolean("is_live");
        String quizDescription = row.getString("quiz_description");

        return new Quiz(id, title, isLive, quizDescription);
    }

    public void addQuiz(Quiz quiz)
    {
        String sql = """
                INSERT INTO quiz
                (quiz_title, quiz_description)
                VALUES (?, ?);
                """;

        jdbcTemplate.update(sql,
                            quiz.getTitle(),
                            quiz.getQuizDescription());

    }
}
