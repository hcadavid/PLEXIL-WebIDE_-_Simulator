/*
 * Copyright (C) 2015 hcadavid
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package edu.eci.arsw.realtimeapp.model;

/**
 *
 * @author hcadavid
 */
public class EncodedRobotEvent {
    
    private String name;
    private int[] values;
    private String clientSessionId;

    public EncodedRobotEvent(String name, int[] values, String clientSessionId) {
        this.name = name;
        this.values = values;
        this.clientSessionId = clientSessionId;
    }

    public EncodedRobotEvent() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int[] getValues() {
        return values;
    }

    public void setValues(int[] values) {
        this.values = values;
    }

    public String getClientSessionId() {
        return clientSessionId;
    }

    public void setClientSessionId(String clientSessionId) {
        this.clientSessionId = clientSessionId;
    }

    @Override
    public String toString() {
        return "EncodedRobotEvent{" + "name=" + name + ", values=" + values + ", clientSessionId=" + clientSessionId + '}';
    }
    


    
    
    
}
