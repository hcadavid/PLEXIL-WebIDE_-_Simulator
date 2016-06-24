/*
 * Copyright (C) 2016 hcadavid
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
package edu.eci.arsw.realtimeapp.interop;

/**
 *
 * @author hcadavid
 */
public class ProcessDescriptor {
    
    final private long pid;
    final private long launchTime;

    public ProcessDescriptor(long pid) {
        this.pid = pid;
        this.launchTime=System.currentTimeMillis();
    }

    public ProcessDescriptor(long pid, long launchTime) {
        this.pid = pid;
        this.launchTime = launchTime;
    }

    public long getPid() {
        return pid;
    }

    public long getLaunchTime() {
        return launchTime;
    }
    
    
            
    
}
