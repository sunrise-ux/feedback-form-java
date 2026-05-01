package com.example.feedback.model;

import java.time.LocalDateTime;

public class FeedbackResponse {
    private boolean success;
    private String message;
    private LocalDateTime timestamp;
    private String receivedData;

    public FeedbackResponse(boolean success, String message, String receivedData) {
        this.success = success;
        this.message = message;
        this.timestamp = LocalDateTime.now();
        this.receivedData = receivedData;
    }

    // Геттеры и сеттеры
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getReceivedData() { return receivedData; }
    public void setReceivedData(String receivedData) { this.receivedData = receivedData; }
}