package com.remote_medical_care_2.cameramodule

import android.os.Handler
import android.os.Message
import android.util.Log
import android.widget.Toast
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.IOException

class CameraController(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext),
    Handler.Callback {

    val TAG = "CameraController"
    private val moduleName = "CameraModule"
    var mHandler = Handler(reactContext.mainLooper, this)
    private var cifVideoData: ByteArray? = null


    override fun getName(): String {
        return moduleName
    }



    private fun sendEvent(reactContext: ReactContext, eventName: String, params: WritableMap?) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }



    override fun initialize() {
        Log.e(TAG, "Initialized is called")
        super.initialize()

        try {
            TCPClient.getInstance()?.info;
        }catch (e: IOException){
            e.printStackTrace()
        }

        val inStream = reactApplicationContext.resources.openRawResource(R.raw.cif)
        try {
            cifVideoData = ByteArray(inStream.available())
            inStream.read(cifVideoData);

        }catch (e: Exception){
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun startCamera(){
        onStartPlayback()
    }

    private fun onStartPlayback(){
        showToast("start show")

        UdpTaskCenter.sharedCenter()?.listen("192.168.1.1", 890);
        UdpTaskCenter.sharedCenter()?.heartBeatTask()
        UdpTaskCenter.sharedCenter()?.setSendHeartBeat(true)
    }


    override fun handleMessage(msg: Message): Boolean {
        return false
    }

    private fun showToast(s: String) {
        Toast.makeText(reactApplicationContext, s, Toast.LENGTH_SHORT).show()
    }

}

