package com.remote_medical_care_2.cameramodule

import android.util.Log
import android.view.Choreographer
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.RelativeLayout
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.annotations.ReactPropGroup
import tv.danmaku.ijk.media.widget.IjkVideoView

class CameraPreviewViewManager(
    private val reactContext: ReactApplicationContext
) : ViewGroupManager<RelativeLayout>() {
    private val TAG = "CameraPreviewViewManager"

    private var propWidth: Int? = null
    private var propHeight: Int? = null
    private var propMarginTop: Int? = null

    private var fragment: CameraPreviewFragment? = null




    override fun getName() = REACT_CLASS

    /**
     * Return a FrameLayout which will later hold the Fragment
     */
    override fun createViewInstance(reactContext: ThemedReactContext): RelativeLayout =
        RelativeLayout(reactContext)



    /**
     * Map the "create" command to an integer
     */
    override fun getCommandsMap() =
        mapOf("create" to COMMAND_CREATE, "rotateVideo" to COMMAND_ROTATE_VIDEO, "startVideo" to COMMAND_START_VIDEO, "stopVideo" to COMMAND_STOP_VIDEO)

    /**
     * Handle "create" command (called from JS) and call createFragment method
     */
    override fun receiveCommand(root: RelativeLayout, commandId: String?, args: ReadableArray?) {
        super.receiveCommand(root, commandId, args)
        val reactNativeViewId = requireNotNull(args).getInt(0)

        if (commandId != null) {
            when (commandId.toInt()) {
                COMMAND_CREATE -> createFragment(root, reactNativeViewId)
                COMMAND_ROTATE_VIDEO -> {
                    fragment?.rotateVideo()
                    val mVideoView = root.findViewById(R.id.video_view) as IjkVideoView

//                    mVideoView!!.setVideoRotation(degree)

//                    val waveData = args.getInt(1)
//                    boWaveView.mDrawWave.addData(waveData)

//                    Log.e(TAG, "Update command called ${args.getInt(1)}")
                }
                COMMAND_START_VIDEO -> fragment?.startVideo()
                COMMAND_STOP_VIDEO -> fragment?.stopVideo()
            }
        }
    }

    @ReactPropGroup(names = ["width", "height", "marginTop"], customType = "Style")
    fun setStyle(view: RelativeLayout, index: Int, value: Int) {
        if (index == 0) propWidth = value
        if (index == 1) propHeight = value
        if (index == 2) propMarginTop = value
    }


    /**
     * Replace your React Native view with a custom fragment
     */
    fun createFragment(root: RelativeLayout, reactNativeViewId: Int) {
        val parentView = root.findViewById<ViewGroup>(reactNativeViewId)
        setupLayout(parentView)

        fragment = CameraPreviewFragment()
        val activity = reactContext.currentActivity as FragmentActivity
        activity.supportFragmentManager
            .beginTransaction()
            .replace(reactNativeViewId, fragment!!, reactNativeViewId.toString())
            .commit()
    }

    fun setupLayout(view: View) {
        Choreographer.getInstance().postFrameCallback(object : Choreographer.FrameCallback {
            override fun doFrame(frameTimeNanos: Long) {
                manuallyLayoutChildren(view)
                view.viewTreeObserver.dispatchOnGlobalLayout()
                Choreographer.getInstance().postFrameCallback(this)
            }
        })
    }

    /**
     * Layout all children properly
     */
    private fun manuallyLayoutChildren(view: View) {
        // propWidth and propHeight coming from react-native props
        val width = requireNotNull(propWidth)
        val height = requireNotNull(propHeight)
        val marginTop = requireNotNull(propMarginTop)

        view.measure(
            View.MeasureSpec.makeMeasureSpec(width, View.MeasureSpec.EXACTLY),
            View.MeasureSpec.makeMeasureSpec(height, View.MeasureSpec.EXACTLY)
        )

        view.layout(0, marginTop, width, height)
    }



    companion object {
        private const val REACT_CLASS = "CameraPreviewViewManager"
        private const val COMMAND_CREATE = 1
        private const val COMMAND_ROTATE_VIDEO = 2
        private const val COMMAND_START_VIDEO = 3
        private const val COMMAND_STOP_VIDEO = 4
    }
}