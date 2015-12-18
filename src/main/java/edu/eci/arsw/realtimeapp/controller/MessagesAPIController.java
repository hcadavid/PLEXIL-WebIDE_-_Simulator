package edu.eci.arsw.realtimeapp.controller;

import edu.eci.arsw.realtimeapp.interop.CompilationException;
import edu.eci.arsw.realtimeapp.interop.PlexilCompiler;
import edu.eci.arsw.realtimeapp.model.Command;
import edu.eci.arsw.realtimeapp.model.Message;
import edu.eci.arsw.realtimeapp.model.RobotEvent;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
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
@PropertySource("classpath:plexilconfig.properties")
public class MessagesAPIController {
    
    
    @Autowired 
    private SimpMessagingTemplate template;  
    
    @Autowired
    Environment env;
    /**
     * Ensures that placeholders are replaced with property values
     */
    @Bean
    static PropertySourcesPlaceholderConfigurer propertyPlaceHolderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }
    
    
    public MessagesAPIController(){
        
        /*new Thread(){
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
        }.start();*/
    }
    
        
    
    /*@MessageMapping("/rutaMensajesEntrantes") 
    public void webSocketMsgHandler(RobotEvent m) {
     System.out.println(">>>>>>"+m);
    }*/
    
    
        
    @MessageMapping("/rutaMensajesEntrantes") 
    public void webSocketMsgHandler(Message m) {
        System.out.println(">>>>>>"+m.getBody());
        template.convertAndSend("/topic/newmessage", new Command(m.getBody()));
    }
    
    
    
    
    @MessageMapping("/compile") 
    public void compile(SimpMessageHeaderAccessor headerAccessor,Message m) {
        String sessionId = headerAccessor.getSessionId(); // Session ID
        String srcFile="/tmp/"+sessionId+System.currentTimeMillis()+".ple";
        try {
            PrintWriter out = new PrintWriter(srcFile);
            out.write(m.getBody());
            out.close();
        } catch (FileNotFoundException ex) {
            Logger.getLogger(MessagesAPIController.class.getName()).log(Level.SEVERE, null, ex);
        }
        try {
            PlexilCompiler.getInstance().compile(srcFile);
            template.convertAndSend("/topic/newmessage", new Command("a"));
            System.out.println("COMPILE OK");
        } catch (CompilationException ex) {
            Logger.getLogger(MessagesAPIController.class.getName()).log(Level.SEVERE, null, ex);
            template.convertAndSend("/topic/newmessage", new Command("b"));
            System.out.println("COMPILE ERROR");
        }
        
    }

       
    
    @RequestMapping(value = "/check",method = RequestMethod.GET)        
    public String check(HttpSession session) {  
        System.out.println(env.getProperty("plexilhome"));
        return "REST API OK"+session.getId();                
    }
    
}

