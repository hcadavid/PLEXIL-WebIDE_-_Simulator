package edu.eci.arsw.realtimeapp.controller;

import edu.eci.arsw.realtimeapp.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author hcadavid
 */
@RestController
@RequestMapping("/messages")
public class MessagesAPIController {
    
    
    @Autowired 
    private SimpMessagingTemplate template;  
    
    @RequestMapping(method = RequestMethod.POST)        
    public ResponseEntity<?> addProduct(@RequestBody Message p) {       
        template.convertAndSend("/topic/newmessage",p);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }
    
    @RequestMapping(value = "/check",method = RequestMethod.GET)        
    public String check() {        
        return "REST API OK";                
    }
    
}

