package com.nianti.controllers;

import com.nianti.services.QuizDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController
{
    @Autowired
    private QuizDao quizDao;

    @GetMapping("/")
    public String index(Model model)
    {
        var quizzes = quizDao.getAllQuizzes();

        var liveQuizzes = quizzes.stream()
                .filter(quiz -> quiz.isLive())
                .toList();

        model.addAttribute("title", "Trivio Home");
        model.addAttribute("quizzes", liveQuizzes);
        
        return "index";
    }
}
