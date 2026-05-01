package com.example.feedback.controller;

import com.example.feedback.model.FeedbackRequest;
import com.example.feedback.model.FeedbackResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*") // Разрешаем запросы с любого источника
public class FeedbackController {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackController.class);

    @PostMapping("/submit")
    public ResponseEntity<FeedbackResponse> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        // Логируем полученные данные
        logger.info("Получена обратная связь от: {}", request.getEmail());
        logger.info("Имя: {}", request.getName());
        logger.info("Сообщение: {}", request.getMessage());

        // Здесь можно сохранить в базу данных, отправить email и т.д.

        // Формируем успешный ответ
        String responseMessage = String.format(
                "Спасибо, %s! Ваше сообщение получено и будет обработано.",
                request.getName()
        );

        String receivedInfo = String.format(
                "Получено: имя='%s', email='%s', сообщение='%s'",
                request.getName(), request.getEmail(), request.getMessage()
        );

        FeedbackResponse response = new FeedbackResponse(true, responseMessage, receivedInfo);
        return ResponseEntity.ok(response);
    }

    // Обработка ошибок валидации (400 Bad Request)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("status", 400);
        response.put("errors", errors);
        response.put("message", "Ошибка валидации данных");

        return ResponseEntity.badRequest().body(response);
    }

    // Обработка других ошибок сервера (500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        logger.error("Внутренняя ошибка сервера: ", ex);

        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("status", 500);
        response.put("message", "Внутренняя ошибка сервера. Попробуйте позже.");

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}