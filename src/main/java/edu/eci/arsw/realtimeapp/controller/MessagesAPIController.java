package edu.eci.arsw.realtimeapp.controller;

import edu.eci.arsw.realtimeapp.interop.CommandReceivedCallback;
import edu.eci.arsw.realtimeapp.interop.CompilationException;
import edu.eci.arsw.realtimeapp.interop.FinishedPlanCallback;
import edu.eci.arsw.realtimeapp.interop.PlanExecutionFailureCallback;
import edu.eci.arsw.realtimeapp.interop.PlexilCompiler;
import edu.eci.arsw.realtimeapp.interop.PlexilExecLauncher;
import edu.eci.arsw.realtimeapp.interop.ProcessKillException;
import edu.eci.arsw.realtimeapp.model.Command;
import edu.eci.arsw.realtimeapp.model.ExecutionRequest;
import edu.eci.arsw.realtimeapp.model.Message;
import edu.eci.arsw.realtimeapp.model.RobotEvent;
import edu.eci.arsw.realtimeapp.model.UEThreadAbortRequest;
import java.io.BufferedWriter;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.lang.reflect.Field;
import java.util.Hashtable;
import java.util.concurrent.ConcurrentHashMap;
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
    
    
    //Process id, OutputStream
    private final ConcurrentHashMap<String,OutputStream> openOutputStreams;
    private final ConcurrentHashMap<String,BufferedWriter> openOutputStreamsWriters;
    private final ConcurrentHashMap<String,Process> processesMap;
    private final ConcurrentHashMap<String,Long> processesIdMap;
    
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
        openOutputStreams=new ConcurrentHashMap<>();
        openOutputStreamsWriters=new ConcurrentHashMap<>();
        processesMap=new ConcurrentHashMap<>();
        processesIdMap=new ConcurrentHashMap<>();
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
    
    /**
     * Abort message handler
     * NOTE: This implementation is not cross-platform (only work in Unix)
     */
    @MessageMapping("/abort") 
    public void abortPlan(SimpMessageHeaderAccessor headerAccessor,final UEThreadAbortRequest er) {
        System.out.println("GOT ABORT COMMAND FROM "+er.getClientSessionId());        
        if (processesIdMap.containsKey(er.getClientSessionId())){
            long plexil_pid=processesIdMap.get(er.getClientSessionId());            
            try {
                PlexilExecLauncher.getInstance().killProcess(plexil_pid);
                processesIdMap.remove(er.getClientSessionId());
                processesMap.remove(er.getClientSessionId());
                System.out.println("KILLED PROCESS "+plexil_pid);        
            } catch (ProcessKillException ex) {
                Logger.getLogger(MessagesAPIController.class.getName()).log(Level.SEVERE, null, ex);
                //template.convertAndSend("/topic/messages/"+er.getClientSessionId(), new Message(sessionId, ex.getLocalizedMessage(),Message.COMPILATION_ERROR));            
            }            
        }
        else{
            Logger.getLogger(MessagesAPIController.class.getName()).log(Level.SEVERE, "NO RUNNING PLEXIL PROCESS FOUND FOR CLIENT SESSION "+er.getClientSessionId());
        }
        
    }
    


    
    @MessageMapping("/execute") 
    public void execute(SimpMessageHeaderAccessor headerAccessor,final ExecutionRequest er) {
        System.out.println("GOT EXECUTE COMMAND FROM "+er.getClientSessionId());
        final String sessionId = headerAccessor.getSessionId(); // Session ID
        //random file name
        String srcSuffix=sessionId+System.currentTimeMillis();
        String srcFile="/tmp/"+srcSuffix+".ple";
        String compiledFile="/tmp/"+srcSuffix+".plx";
        try {
            PrintWriter out = new PrintWriter(srcFile);
            out.write(er.getSource());
            out.close();
        } catch (FileNotFoundException ex) {
            Logger.getLogger(MessagesAPIController.class.getName()).log(Level.SEVERE, null, ex);
        }
        try {
            PlexilCompiler.getInstance().compile(env.getProperty("plexilhome"),srcFile);
            Process p = PlexilExecLauncher.getInstance().createPlanExecutionProcess(
                    env.getProperty("plexilhome"),
                    env.getProperty("interfaceconfig"),
                    compiledFile,
                    new CommandReceivedCallback() {
                        @Override
                        public void execute(String cmd) {
                            System.out.println("Sending command:" + cmd+" to /topic/command/"+er.getClientSessionId());                                   
                            template.convertAndSend("/topic/command/"+er.getClientSessionId(), new Command(cmd));
                        }
                    },
                    new FinishedPlanCallback() {
                        @Override
                        public void execute() {
                            template.convertAndSend("/topic/messages/"+er.getClientSessionId(), new Message(sessionId, "Plan execution success.",Message.PLAN_SUCCESS));            
                            /*try {
                                openOutputStreams.get(er.getClientSessionId()).close();
                            } catch (IOException ex) {
                                Logger.getLogger(MessagesAPIController.class.getName()).log(Level.SEVERE, null, ex);
                            }*/
                        }
                    },
                    new PlanExecutionFailureCallback() {
                        @Override
                        public void execute(String msg) {
                            template.convertAndSend("/topic/messages/"+er.getClientSessionId(), new Message(sessionId, "Plan execution failed:"+msg,Message.PLAN_EXECUTION_ERROR));            
                        }
                    });  
            System.out.println(">>>> PROCESS CREATED "+getPidOfProcess(p));
            
            OutputStream os=p.getOutputStream();
            openOutputStreams.put(er.getClientSessionId(), os);
            openOutputStreamsWriters.put(er.getClientSessionId(), new BufferedWriter(new OutputStreamWriter(os)));
            processesMap.put(er.getClientSessionId(), p);
            processesIdMap.put(er.getClientSessionId(), getPidOfProcess(p));
            
        } catch (CompilationException ex) {            
            Logger.getLogger(MessagesAPIController.class.getName()).log(Level.SEVERE, null, ex);
            template.convertAndSend("/topic/messages/"+er.getClientSessionId(), new Message(sessionId, ex.getLocalizedMessage(),Message.COMPILATION_ERROR));            
        } catch (IOException ex) {
            Logger.getLogger(MessagesAPIController.class.getName()).log(Level.SEVERE, null, ex);
        }
        
    }

    
    
    @MessageMapping("/compile") 
    public void compile(SimpMessageHeaderAccessor headerAccessor,ExecutionRequest er) {
        System.out.println("GOT EXECUTE COMMAND FROM "+er.getClientSessionId());
        String sessionId = headerAccessor.getSessionId(); // Session ID
        //random file name
        String srcFile="/tmp/"+sessionId+System.currentTimeMillis()+".ple";
        try {
            PrintWriter out = new PrintWriter(srcFile);
            out.write(er.getSource());
            out.close();
        } catch (FileNotFoundException ex) {
            Logger.getLogger(MessagesAPIController.class.getName()).log(Level.SEVERE, ex.getLocalizedMessage(), ex);
        }
        try {
            PlexilCompiler.getInstance().compile(env.getProperty("plexilhome"),srcFile);
            template.convertAndSend("/topic/messages/"+er.getClientSessionId(), new Message(sessionId, "Compilation success.",Message.COMPILATION_SUCCES));            
        } catch (CompilationException ex) {            
            Logger.getLogger(MessagesAPIController.class.getName()).log(Level.SEVERE, null, ex);
            template.convertAndSend("/topic/messages/"+er.getClientSessionId(), new Message(sessionId, ex.getLocalizedMessage(),Message.COMPILATION_ERROR));            
        }
        
    }


    @MessageMapping("/event") 
    public void receiveEvent(SimpMessageHeaderAccessor headerAccessor,RobotEvent re) {
        //System.out.println("[SERVER-SIDE] FORWARDING EVENT FROM "+re.getClientSessionId()+" to PLEXIL UE:"+re.getValue());
        if (re.getName().equals("encoded.sensor.data")){
            try {
                BufferedWriter bw=openOutputStreamsWriters.get(re.getClientSessionId());                
                bw.write(re.getValue()+"\n");
                bw.flush();
                
            } catch (IOException ex) {
                Logger.getLogger(MessagesAPIController.class.getName()).log(Level.SEVERE, ex.getLocalizedMessage(), ex);
            }            
        }
        else{
            Logger.getLogger(MessagesAPIController.class.getName()).log(Level.SEVERE, "Unsupported event: encoded.sensor.data");
        }
        
    }    
    
    
    @RequestMapping(value = "/check",method = RequestMethod.GET)        
    public String check(HttpSession session) {  
        System.out.println(env.getProperty("plexilhome"));
        return "REST API OK"+session.getId();                
    }
 
    private static long getPidOfProcess(Process p) {
        long pid = -1;

        try {
            if (p.getClass().getName().equals("java.lang.UNIXProcess")) {
                Field f = p.getClass().getDeclaredField("pid");
                f.setAccessible(true);
                pid = f.getLong(p);
                f.setAccessible(false);
            }
        } catch (NoSuchFieldException | IllegalArgumentException | IllegalAccessException e) {
            pid = -1;
        }
        return pid;
    }
    


    
}

