package edu.eci.arsw.realtimeapp.controller;

import edu.eci.arsw.realtimeapp.model.Command;
import edu.eci.arsw.realtimeapp.model.Message;
import edu.eci.arsw.realtimeapp.model.RobotEvent;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
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
    
    public MessagesAPIController(){
        new Thread(){
            public void run(){
                while (true) {
                    System.out.println("Message send attempt...");
                    try {
                        Thread.sleep(5000);
                        if (template != null) {
                            template.convertAndSend("/topic/newmessage", new Command("38"));
                            Thread.sleep(1000);
                            template.convertAndSend("/topic/newmessage", new Command("83"));

                        }
                    } catch (InterruptedException ex) {
                        Logger.getLogger(MessagesAPIController.class.getName()).log(Level.SEVERE, null, ex);
                    }

                    
                }
            }            
        }.start();
    }
    
        
    
    /*@MessageMapping("/rutaMensajesEntrantes") 
    public void webSocketMsgHandler(RobotEvent m) {
     System.out.println(">>>>>>"+m);
    }*/
    
    
        
    @MessageMapping("/rutaMensajesEntrantes") 
    public void webSocketMsgHandler(Message m) {
     System.out.println(">>>>>>"+m);
    }
    
    
    @RequestMapping(value = "/check",method = RequestMethod.GET)        
    public String check() {        
        return "REST API OK";                
    }
    
}

