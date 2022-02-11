package de.tekup.chatApp.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import de.tekup.chatApp.model.Message;

@Controller
public class WebController {

	@MessageMapping("/hello")
	@SendTo("/topic/hi")
	public Message getMessage(Message message) throws Exception {
		return message;
	}
}
