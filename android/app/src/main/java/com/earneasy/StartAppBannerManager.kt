package com.earneasy

import android.content.Context
import android.view.View
import android.widget.LinearLayout
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.startapp.sdk.ads.banner.Banner

class StartAppBannerManager : SimpleViewManager<LinearLayout>() {
    override fun getName(): String {
        return "StartAppBanner"
    }

    override fun createViewInstance(reactContext: ThemedReactContext): LinearLayout {
        val layout = LinearLayout(reactContext)
        val bannerAd = Banner(reactContext)

        layout.addView(bannerAd)
        return layout
    }
}
