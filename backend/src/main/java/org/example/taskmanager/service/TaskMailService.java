package org.example.taskmanager.service;

import org.example.taskmanager.model.Task;
import org.example.taskmanager.model.User;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

public class TaskMailService {
    private static final String FROM = "updates.taskmanager@gmail.com";
    private static final String PASSWORD = "tzzn wzzt oity ciag";
    private static final String HOST = "smtp.gmail.com";

    private static Session getSession() {
        Properties properties = System.getProperties();
        properties.put("mail.smtp.host", HOST);
        properties.put("mail.smtp.port", "465");
        properties.put("mail.smtp.ssl.enable", "true");
        properties.put("mail.smtp.auth", "true");
        return Session.getInstance(properties, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(FROM, PASSWORD);
            }
        });
    }

    public static void sendTaskCreatedMail(Task task) {
        sendMail(task.getUser().getEmail(), "Task Created: " + task.getName(),
                "A new task has been created for you.\n\n" +
                getTaskDetails(task));
    }

    public static void sendTaskUpdatedMail(Task task) {
        sendMail(task.getUser().getEmail(), "Task Updated: " + task.getName(),
                "Your task has been updated.\n\n" +
                getTaskDetails(task));
    }

    public static void sendTaskDeletedMail(Task task) {
        sendMail(task.getUser().getEmail(), "Task Deleted: " + task.getName(),
                "Your task has been deleted.\n\n" +
                getTaskDetails(task));
    }

    private static void sendMail(String to, String subject, String body) {
        try {
            Session session = getSession();
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(FROM));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
            message.setSubject(subject);
            message.setText(body);
            Transport.send(message);
        } catch (MessagingException mex) {
            mex.printStackTrace();
        }
    }

    private static String getTaskDetails(Task task) {
        StringBuilder sb = new StringBuilder();
        sb.append("Task Name: ").append(task.getName()).append("\n");
        sb.append("Description: ").append(task.getDescription() != null ? task.getDescription() : "").append("\n");
        sb.append("Priority: ").append(task.getPriority() != null ? task.getPriority() : "").append("\n");
        sb.append("Completed: ").append(task.isCompleted() ? "Yes" : "No").append("\n");
        sb.append("Due Date: ").append(task.getLastDate() != null ? task.getLastDate() : "").append("\n");
        return sb.toString();
    }
}
