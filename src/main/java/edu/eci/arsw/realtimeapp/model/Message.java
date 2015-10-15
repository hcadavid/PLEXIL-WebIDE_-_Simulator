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

    public Message(String destiny, String body) {
        this.destiny = destiny;
        this.body = body;
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

    
    
}
