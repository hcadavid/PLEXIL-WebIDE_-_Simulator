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
package edu.eci.arsw.realtimeapp.interop;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author hcadavid
 */
public class PlexilExecLauncher {

    private static final PlexilExecLauncher instance = new PlexilExecLauncher();

    private PlexilExecLauncher() {
    }

    public static PlexilExecLauncher getInstance() {
        return instance;
    }

    public Process createPlanExecutionProcess(String planPath, 
            final CommandReceivedCallback cmdcb,
            final FinishedPlanCallback finishcb, 
            final PlanExecutionFailureCallback errorcb) throws IOException {
        String cmd1 = "/bin/bash";
        ProcessBuilder pb = new ProcessBuilder(cmd1, "-c", "$PLEXIL_HOME/scripts/plexilexec -p " + planPath + " -c /Users/hcadavid/ECI/2015-2/Robotics-Plexil/source-adapter/robotics-interfacing/interface-config.xml");
        Map<String, String> env = pb.environment();
        env.put("PLEXIL_HOME", "/Users/hcadavid/apps/plexil-4.0.1");
        final Process p = pb.start();
        
        final InputStream is = p.getInputStream();
        final BufferedReader br = new BufferedReader(new InputStreamReader(is));

        
        //execute callback when plan is finished
        new Thread() {
            public void run() {
                int r;
                try {
                    r = p.waitFor(); // Let the process finish.
                    if (r == 0) { // No error
                        finishcb.execute();
                    } else { //error
                        errorcb.execute();
                    }
                } catch (InterruptedException ex) {
                    Logger.getLogger(PlexilExecLauncher.class.getName()).log(Level.SEVERE, null, ex);
                    throw new RuntimeException("Error generated by plan execution callback thread.",ex);
                }
            }
        }.start();
        
        //thread to handle the commands generated by UE with a callback
        new Thread() {
            public void run() {
                try {
                    String line=null;
                    while ((line = br.readLine()) != null) {
                        if (line.startsWith("[CMD]")) {
                            cmdcb.execute(line);
                        }                        
                    }
                } catch (IOException ex) {
                    Logger.getLogger(PlexilExecLauncher.class.getName()).log(Level.SEVERE, null, ex);
                    throw new RuntimeException("Error generated by command reception callback thread.",ex);
                }
                
            }
        }.start();

        return p;
    }

    public static void main(String args[]) throws IOException {
        Process p = PlexilExecLauncher.getInstance().createPlanExecutionProcess("/Users/hcadavid/ECI/2015-2/Robotics-Plexil/source-adapter/robotics-interfacing/custom-plans/plan3.plx",
                new CommandReceivedCallback() {
                    @Override
                    public void execute(String cmd) {
                        System.out.println("Command received:" + cmd);
                    }
                },
                new FinishedPlanCallback() {
                    @Override
                    public void execute() {
                        System.out.println("Plan finished!!!");
                    }
                },
                new PlanExecutionFailureCallback() {
                    @Override
                    public void execute() {
                        System.out.println("Plan error!");
                    }
                });

        OutputStream os = p.getOutputStream();

        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(os));

        new ExecutiveInput(bw).start();

    }

}

class ExecutiveInput extends Thread {

    Writer w;

    public ExecutiveInput(Writer w) {
        this.w = w;
    }

    public void run() {
        try {
            Thread.sleep(10000);
            w.write("ws\n");
            w.flush();
            System.out.println("Sending ws");
            Thread.sleep(10000);
            System.out.println("Sending temp");
            w.write("temp\n");
            w.flush();
        } catch (InterruptedException ex) {
            Logger.getLogger(ExecutiveInput.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(ExecutiveInput.class.getName()).log(Level.SEVERE, null, ex);
        }

    }

}