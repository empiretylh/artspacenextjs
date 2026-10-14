package co.median.android.krrajyp;

import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;

import androidx.core.splashscreen.SplashScreen;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginHandle;
import com.getcapacitor.WebViewListener;

import ee.forgr.capacitor.social.login.GoogleProvider;
import ee.forgr.capacitor.social.login.ModifiedMainActivityForSocialLoginPlugin;
import ee.forgr.capacitor.social.login.SocialLoginPlugin;

public class MainActivity extends BridgeActivity implements ModifiedMainActivityForSocialLoginPlugin {

    private static final long SPLASH_TIMEOUT_MS = 5000;

    private ConnectivityManager connectivityManager;
    private ConnectivityManager.NetworkCallback networkCallback;
    private View offlineView;
    private boolean pageLoaded = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen splashScreen = SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);

        final long start = System.currentTimeMillis();
        splashScreen.setKeepOnScreenCondition(() -> {
            if (System.currentTimeMillis() - start > SPLASH_TIMEOUT_MS) {
                return false;
            }
            WebView webView = getBridge() != null ? getBridge().getWebView() : null;
            return webView == null || webView.getProgress() < 100;
        });

        setupOfflineView();
        registerNetworkMonitoring();
    }

    private void setupOfflineView() {
        ViewGroup root = findViewById(android.R.id.content);
        offlineView = LayoutInflater.from(this).inflate(R.layout.offline_view, root, false);
        offlineView.setVisibility(View.GONE);
        root.addView(offlineView);

        offlineView.findViewById(R.id.offline_retry).setOnClickListener(v -> retry());

        if (getBridge() != null) {
            getBridge().addWebViewListener(new WebViewListener() {
                @Override
                public void onPageStarted(WebView webView) {
                    pageLoaded = false;
                }

                @Override
                public void onPageLoaded(WebView webView) {
                    pageLoaded = true;
                    runOnUiThread(() -> offlineView.setVisibility(View.GONE));
                }
            });
        }

        if (!isConnected()) {
            offlineView.setVisibility(View.VISIBLE);
        }
    }

    private void registerNetworkMonitoring() {
        connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        if (connectivityManager == null) {
            return;
        }

        networkCallback = new ConnectivityManager.NetworkCallback() {
            @Override
            public void onAvailable(Network network) {
                if (offlineView != null && offlineView.getVisibility() == View.VISIBLE) {
                    runOnUiThread(() -> offlineView.setVisibility(View.GONE));
                    WebView webView = getBridge() != null ? getBridge().getWebView() : null;
                    if (webView != null) {
                        runOnUiThread(webView::reload);
                    }
                }
            }

            @Override
            public void onLost(Network network) {
                // Only take over when the app content never loaded (cold start / load
                // failure). While the site is already loaded the in-app web overlay
                // handles the disconnected state.
                if (!pageLoaded && offlineView != null) {
                    runOnUiThread(() -> offlineView.setVisibility(View.VISIBLE));
                }
            }
        };

        connectivityManager.registerDefaultNetworkCallback(networkCallback);
    }

    private void retry() {
        if (isConnected()) {
            offlineView.setVisibility(View.GONE);
        }
        WebView webView = getBridge() != null ? getBridge().getWebView() : null;
        if (webView != null) {
            webView.reload();
        }
    }

    private boolean isConnected() {
        if (connectivityManager == null) {
            return true;
        }
        Network active = connectivityManager.getActiveNetwork();
        if (active == null) {
            return false;
        }
        NetworkCapabilities capabilities = connectivityManager.getNetworkCapabilities(active);
        return capabilities != null
            && capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
            && capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode >= GoogleProvider.REQUEST_AUTHORIZE_GOOGLE_MIN
            && requestCode < GoogleProvider.REQUEST_AUTHORIZE_GOOGLE_MAX) {
            PluginHandle pluginHandle = getBridge().getPlugin("SocialLogin");
            if (pluginHandle == null) {
                return;
            }
            Plugin plugin = pluginHandle.getInstance();
            if (plugin instanceof SocialLoginPlugin) {
                ((SocialLoginPlugin) plugin).handleGoogleLoginIntent(requestCode, data);
            }
        }
    }

    @Override
    public void IHaveModifiedTheMainActivityForTheUseWithSocialLoginPlugin() {
        // Required by ModifiedMainActivityForSocialLoginPlugin; never called.
    }

    @Override
    public void onDestroy() {
        if (connectivityManager != null && networkCallback != null) {
            try {
                connectivityManager.unregisterNetworkCallback(networkCallback);
            } catch (IllegalArgumentException ignored) {
                // Callback was never registered.
            }
        }
        super.onDestroy();
    }
}
