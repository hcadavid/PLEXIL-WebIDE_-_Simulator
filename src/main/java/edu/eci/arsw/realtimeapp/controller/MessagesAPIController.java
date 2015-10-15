package edu.eci.arsw.realtimeapp.controller;

import edu.eci.arsw.realtimeapp.model.Message;
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
                while (true){
                    System.out.println("Message send attempt...");
                    try {
                        Thread.sleep(5000);
                    } catch (InterruptedException ex) {
                        Logger.getLogger(MessagesAPIController.class.getName()).log(Level.SEVERE, null, ex);
                    }
                    if (template!=null){
                        template.convertAndSend("/topic/newmessage",new Message("me", "hello"));
                    }
                    
                }
            }            
        }.start();
    }
    
    @RequestMapping(method = RequestMethod.POST)        
    public ResponseEntity<?> addProduct(@RequestBody Message p) {       
        template.convertAndSend("/topic/newmessage",p);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }
        
    
    @MessageMapping("/rutaMensajesEntrantes") 
    public void webSocketMsgHandler(Message m) {
     System.out.println(">>>>>>"+m);
    }
    
    
    @RequestMapping(value = "/check",method = RequestMethod.GET)        
    public String check() {        
        return "REST API OK";                
    }
    
}

