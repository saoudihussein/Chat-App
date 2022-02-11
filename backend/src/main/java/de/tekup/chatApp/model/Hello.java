package de.tekup.chatApp.model;

import java.time.LocalDateTime;

public class Hello {
	private String name;
	private String message;
	private String time;

	public Hello() {
	}
	
	

	public Hello(String name, String message) {
		super();
		this.name = name;
		this.message = message;
		this.time=String.format("%d:%02d", LocalDateTime.now().getHour(), LocalDateTime.now().getMinute());
		
	}



	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	public void setTime(String time) {
		this.time = time;
	}

	
}
