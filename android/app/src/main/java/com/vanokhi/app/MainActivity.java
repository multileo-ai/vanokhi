package com.vanokhi.app;

import android.os.Bundle; // Required for onCreate
import com.getcapacitor.BridgeActivity;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth; // Import the plugin

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // This explicitly registers the Google Auth plugin with the Capacitor bridge
        registerPlugin(GoogleAuth.class);
    }
}