/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.realtimeapp.model;

/**
 *
 * @author hcadavid
 */
public class Message {
    
    private String destiny;
    private String body;
    private Integer messageId;
    
    public static final int COMPILATION_ERROR=0;
    public static final int COMPILATION_SUCCES=1;
    public static final int PLAN_EXECUTION_ERROR=2;
    public static final int PLAN_SUCCESS=3;
    public static final int PLATFORM_ERROR=4;

    public Message(String destiny, String body, Integer messageId) {
        this.destiny = destiny;
        this.body = body;
        this.messageId = messageId;
    }
    
    public Message() {
    }

    public String getDestiny() {
        return destiny;
    }

    public void setDestiny(String destiny) {
        this.destiny = destiny;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public Integer getMessageId() {
        return messageId;
    }

    
    
}
