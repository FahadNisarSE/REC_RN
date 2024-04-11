package com.remote_medical_care_2

import android.widget.RelativeLayout
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewGroupManager
import com.remote_medical_care_2.visionmodule.VisionController


class SmartDevicesPackage : ReactPackage {
    override fun createNativeModules(reactAppContext: ReactApplicationContext): MutableList<NativeModule> {
        val modules: MutableList<NativeModule> = arrayListOf()
        modules.add(VisionController(reactAppContext))

        return modules
    }

    override fun createViewManagers(reactAppContext: ReactApplicationContext): MutableList<ViewGroupManager<RelativeLayout>> {
        return mutableListOf(
            BoGraphViewManager(reactAppContext),
            EcgChartViewManager(reactAppContext),
        )
    }
}