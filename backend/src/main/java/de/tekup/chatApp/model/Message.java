package de.tekup.chatApp.model;

import java.time.LocalDateTime;

public class Message {
	private String name;
	private String message;
	private String time;

	public Message() {
	}

	public Message(String name, String message, String time) {
		super();
		this.name = name;
		this.message = message;
		this.time = time;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return this.name;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getTime() {
		return time;
	}

	public void setTime() {
		this.time = LocalDateTime.now().getHour() + ":" + LocalDateTime.now().getMinute();

	}
}
