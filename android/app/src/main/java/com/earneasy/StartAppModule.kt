package com.earneasy

import android.app.Activity
import androidx.annotation.NonNull
import com.facebook.react.bridge.*
import com.startapp.sdk.adsbase.StartAppAd
import com.startapp.sdk.adsbase.adlisteners.AdDisplayListener
import com.startapp.sdk.adsbase.adlisteners.VideoListener

class StartAppModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var startAppAd: StartAppAd? = null
    private var rewardedAd: StartAppAd? = null

    init {
        startAppAd = StartAppAd(reactContext)
        rewardedAd = StartAppAd(reactContext)
    }

    override fun getName(): String {
        return "StartAppModule"
    }

    // Show Interstitial Ad
    @ReactMethod
    fun showInterstitialAd() {
        val activity: Activity? = currentActivity
        activity?.runOnUiThread {
            startAppAd?.showAd()
        }
    }

    // Show Rewarded Ad
    @ReactMethod
    fun showRewardedAd(promise: Promise) {
        val activity: Activity? = currentActivity
        activity?.runOnUiThread {
            rewardedAd?.setVideoListener(object : VideoListener {
                override fun onVideoCompleted() {
                    promise.resolve(true) // Reward the user
                }
            })
            rewardedAd?.showAd()
        }
    }
}
