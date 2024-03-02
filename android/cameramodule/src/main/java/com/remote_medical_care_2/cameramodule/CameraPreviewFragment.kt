package com.remote_medical_care_2.cameramodule

import android.os.Bundle
import android.os.Environment
import android.os.Handler
import android.os.Looper.getMainLooper
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ProgressBar
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.remote_medical_care.videoplayer_media.widget.IRenderView
import com.remote_medical_care.videoplayer_media.widget.IjkMpOptions
import com.remote_medical_care.videoplayer_media.widget.IjkVideoView
import com.remote_medical_care_2.video_player_java_module.IjkMediaPlayer
import java.io.File
import java.io.IOException
import java.nio.charset.Charset
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.Timer

private const val ARG_PARAM1 = "param1"
private const val ARG_PARAM2 = "param2"

class CameraPreviewFragment : Fragment() {
    // TODO: Rename and change types of parameters
    private var param1: String? = null
    private var param2: String? = null
    private val TAG = "CameraPreviewFragment"

    private var mTakePictureButton: Button? = null
    private var mRecordVideoButton: Button? = null
    private var mSetVrModeButton: Button? = null
    private var mSetVideoRotationButton: Button? = null
    private var mSetVideoRotation180Button: Button? = null


    private var mProgressBar: ProgressBar? = null

    /* 预览设置 */ // 渲染视图，不需要更改
    private val VIDEO_VIEW_RENDER: Int = IjkVideoView.RENDER_TEXTURE_VIEW

    // 拉伸方式，根据需要选择等比例拉伸或者全屏拉伸等
    private val VIDEO_VIEW_ASPECT: Int = IRenderView.AR_4_3_FIT_PARENT

    // 重连等待间隔，单位ms
    private val RECONNECT_INTERVAL = 500

    private var mVideoPath: String? = null
    private var mVideoView: IjkVideoView? = null

    private lateinit var cifVideoData: ByteArray
    private val inserting = false
    private val mInsertTimer: Timer? = null

    private var bOutputVideo = false

    // 状态
    private var recording = false
    private var videoRotationDegree = 0
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        try {
            TCPClient.getInstance()?.info
        } catch (e: IOException) {
            e.printStackTrace()
        }
//        reqWrite()

//        init player
        // init player
        IjkMediaPlayer.loadLibrariesOnce(null)
        IjkMediaPlayer.native_profileBegin("libijkplayer.so")

        // handle arguments
        mVideoPath = Constants.RTSP_ADDRESS

        mVideoView = view?.findViewById(R.id.video_view) as IjkVideoView
        // init player
        // init player
        if (!initVideoView(mVideoView, mVideoPath)) {
            Log.e(TAG, "initVideoView fail")
//            finish()
        }

        // load video data

        // load video data
        val inStream = resources.openRawResource(R.raw.cif)
        try {
            cifVideoData = ByteArray(inStream.available())
            inStream.read(cifVideoData)
        }catch (e: Exception){
            e.printStackTrace()
        }


        /* 按键 */
        mTakePictureButton = view?.findViewById(R.id.take_picture_button) as Button
        mTakePictureButton!!.setOnClickListener( object : View.OnClickListener {
            override fun onClick(v: View?) {
                takePhoto(1)
            }
        })

        mRecordVideoButton = view?.findViewById(R.id.record_video_button) as Button
        mRecordVideoButton!!.setOnClickListener( object : View.OnClickListener {
            override fun onClick(v: View?) {
                recordVideo()
            }
        })

        mSetVrModeButton = view?.findViewById(R.id.set_vr_mode_button) as Button
        mSetVrModeButton!!.setOnClickListener(View.OnClickListener {
            val isVrMode = mVideoView!!.isVrMode
            setVrMode(!isVrMode)
        })

        mSetVideoRotationButton = view?.findViewById(R.id.set_video_rotation_button) as Button
        mSetVideoRotationButton!!.setOnClickListener(View.OnClickListener {
            videoRotationDegree += 90
            videoRotationDegree %= 360
            setVideoRotation(videoRotationDegree)
        })

        mSetVideoRotation180Button = view?.findViewById(R.id.set_video_rotation_180_button) as Button
        mSetVideoRotation180Button!!.setOnClickListener(View.OnClickListener {
            val isRotation180 = mVideoView!!.isRotation180
            setVideoRotation180(!isRotation180)
        })


        /* 进度条 */mProgressBar = view?.findViewById(R.id.progressBar) as ProgressBar
        setTakePhotoCallBack()

        arguments?.let {
//            param1 = it.getString(com.remote_medical_care_2.ARG_PARAM1)
//            param2 = it.getString(com.remote_medical_care_2.ARG_PARAM2)
        }
    }

    /* IjkPlayer */
    private fun initVideoView(videoView: IjkVideoView?, videoPath: String?): Boolean {
        if (videoView == null) return false

        // init player
        videoView.setRender(VIDEO_VIEW_RENDER)
        videoView.setAspectRatio(VIDEO_VIEW_ASPECT)

        videoView.setOnPreparedListener(mPlayerPreparedListener)
        videoView.setOnErrorListener(mPlayerErrorListener)
        videoView.setOnReceivedRtcpSrDataListener(mReceivedRtcpSrDataListener)
        videoView.setOnReceivedDataListener(mReceivedDataListener)

        // resultCode，<0 发生错误，=0 拍下一张照片，=1，完成拍照
        videoView.setOnTookPictureListener(mTookPictureListener)
        // resultCode，<0 发生错误，=0开始录像，否则就是成功保存录像
        videoView.setOnRecordVideoListener(mRecordVideoListener)
        // 输出图像数据
        videoView.setOnReceivedFrameListener(mReceivedFrameListener)
        // 输出原始图像数据
        videoView.setOnReceivedOriginalDataListener(mReceivedOriginalDataListener)
        // 播放完成后
        videoView.setOnCompletionListener(mPlayerCompletionListener)

        // set options before setVideoPath
        applyOptionsToVideoView(videoView)

        // prefer mVideoPath
        if (videoPath != null) videoView.setVideoPath(videoPath) else {
            Log.e(TAG, "Null Data Source\n")
            return false
        }
        return true
    }

    private fun applyOptionsToVideoView(videoView: IjkVideoView) {
        // default options
        val options: IjkMpOptions = IjkMpOptions.defaultOptions()
        // custom options


        //            if (TextUtils.isEmpty(pixelFormat)) {

//            } else {
//                ijkMediaPlayer.setOption(IjkMediaPlayer.OPT_CATEGORY_PLAYER, "overlay-format", "fcc-_es2"); // OpenGL ES2
//            }
        options.setPlayerOption("framedrop", 1)
        options.setPlayerOption("start-on-prepared", 0)

//            ijkMediaPlayer.setOption(IjkMediaPlayer.OPT_CATEGORY_FORMAT, "rtsp_transport", "tcp");
        options.setPlayerOption("initial_timeout", 500000)
        options.setPlayerOption("stimeout", 500000)
        options.setPlayerOption("http-detect-range-support", 0)
        options.setPlayerOption("iformat", "mjpeg")
        options.setPlayerOption("skip_loop_filter", 48)
        options.setPlayerOption("mediacodec", 0)
        // JPEG解析方式，默认使用填充方式（即网络数据包丢失，则用上一帧数据补上），可以改为DROP（丢失数据包则丢掉整帧，网络不好不要使用），ORIGIN（原始方式，不要使用）
        options.setPlayerOption(
            "rtp-jpeg-parse-packet-method",
            IjkMpOptions.RTP_JPEG_PARSE_PACKET_METHOD_FILL.toLong()
        )
        // 读图像帧超时时间，单位us。如果在这个时间内接收不到一个完整图像，则断开连接
        options.setPlayerOption("readtimeout", 5000 * 1000)
        // Image type (PREFERRED_IMAGE_TYPE_*)
        options.setPlayerOption("preferred-image-type", IjkMpOptions.PREFERRED_IMAGE_TYPE_JPEG.toLong())
        // Image quality, available for lossy format (min and max are both from 1 to 51, 0 < min <= max, smaller is better, default is 2 and 31)
        options.setPlayerOption("image-quality-min", 2)
        options.setPlayerOption("image-quality-max", 20)
        // video
        options.setPlayerOption("preferred-video-type", IjkMpOptions.PREFERRED_VIDEO_TYPE_H264.toLong())
        options.setPlayerOption("video-need-transcoding", 1)
        options.setPlayerOption("mjpeg-pix-fmt", IjkMpOptions.MJPEG_PIX_FMT_YUVJ422P.toLong())
        // video quality, for MJPEG and MPEG4
        options.setPlayerOption("video-quality-min", 2)
        options.setPlayerOption("video-quality-max", 20)
        // x264 preset, tune and profile, for H264
        options.setPlayerOption("x264-option-preset", IjkMpOptions.X264_PRESET_ULTRAFAST.toLong())
        options.setPlayerOption("x264-option-tune", IjkMpOptions.X264_TUNE_ZEROLATENCY.toLong())
        options.setPlayerOption("x264-option-profile", IjkMpOptions.X264_PROFILE_MAIN.toLong())
        options.setPlayerOption("x264-params", "crf=20")
        // apply options to VideoView
        videoView.setOptions(options)
    }

    private val mPlayerPreparedListener: IjkVideoView.IVideoView.OnPreparedListener =
        object : IjkVideoView.IVideoView.OnPreparedListener {
            override fun onPrepared(videoView: IjkVideoView?) {
                onStartPlayback()
            }
        }

    private val mPlayerErrorListener: IjkVideoView.IVideoView.OnErrorListener =
        object : IjkVideoView.IVideoView.OnErrorListener {
            override fun onError(videoView: IjkVideoView?, what: Int, extra: Int): Boolean {
                stopAndRestartPlayback()
                return true
            }
        }

    private val mReceivedRtcpSrDataListener: IjkVideoView.IVideoView.OnReceivedRtcpSrDataListener =
        object : IjkVideoView.IVideoView.OnReceivedRtcpSrDataListener {
            override fun onReceivedRtcpSrData(videoView: IjkVideoView?, data: ByteArray) {
                // 因为数据通道是和RTCP共用，所以回传数据需要和RTCP的Sender Report区分开，需要加上自己的标志区分
                // RTCP默认每5秒发送一次Sender Report
                Log.d(
                    TAG,
                    String(data) + data.contentToString()
                )
            }
        }

    private val mReceivedDataListener: IjkVideoView.IVideoView.OnReceivedDataListener = object : IjkVideoView.IVideoView.OnReceivedDataListener {
        override fun onReceivedData(videoView: IjkVideoView?, data: ByteArray?) {
            // work with firmware api -> wifi_data_send
            val cmd = String(data!!, Charset.forName("utf-8"))
            if (cmd == "TAKE PHOTO") {
                takePhoto(1)
            } else if (cmd == "RECORD VIDEO") {
                recordVideo()
            }
        }
    }

    private val mTookPictureListener: IjkVideoView.IVideoView.OnTookPictureListener =
        object : IjkVideoView.IVideoView.OnTookPictureListener {
            override fun onTookPicture(videoView: IjkVideoView?, resultCode: Int, fileName: String) {
                if (resultCode == 1) {
                    showToast("photo down")
                } else if (resultCode == 0) {
                    showToast("photo saved：$fileName")
                } else if (resultCode < 0) {
                    showToast("photo error")
                }
            }
        }

    private val mRecordVideoListener: IjkVideoView.IVideoView.OnRecordVideoListener =
        object : IjkVideoView.IVideoView.OnRecordVideoListener {
            override fun onRecordVideo(videoView: IjkVideoView?, resultCode: Int, fileName: String?) {
                val handler: Handler = Handler(getMainLooper())
                handler.post {
                    if (resultCode < 0) {
                        recording = false
                        mRecordVideoButton!!.text = "start record"
                        showToast("record error")
                    } else if (resultCode == 0) {
                        recording = true
                        mRecordVideoButton!!.text = "stop record"
                        showToast("start record")
                    } else {
                        mRecordVideoButton!!.text = "start record"
                        showToast("record over")

                        // set flag
                        recording = false
                    }
                }
            }
        }


    private val mReceivedFrameListener: IjkVideoView.IVideoView.OnReceivedFrameListener =
        object : IjkVideoView.IVideoView.OnReceivedFrameListener {
            override fun onReceivedFrame(
                videoView: IjkVideoView?,
                data: ByteArray,
                width: Int,
                height: Int,
                pixelFormat: Int
            ) {
                Log.d(
                    TAG,
                    "OnReceivedFrameListener: len = " + data.size + ", w = " + width + ", h = " + height + ", pf = " + pixelFormat
                )
            }
        }

    private val mReceivedOriginalDataListener: IjkVideoView.IVideoView.OnReceivedOriginalDataListener =
        object : IjkVideoView.IVideoView.OnReceivedOriginalDataListener {
            override fun onReceivedOriginalData(
                videoView: IjkVideoView?,
                data: ByteArray?,
                width: Int,
                height: Int,
                pixelFormat: Int,
                videoId: Int,
                degree: Int
            ) {
                val degreenow = degree % 360
//                this.runOnUiThread(Runnable {
                    // mVideoView.setmVideoRotationDegree(-degreenow);
//                })
                Log.e("arsen", "degreenow$degreenow")
                // Log.e(TAG, "OnReceivedOriginalDataListener: len = " + data.length + ", w = " + width + ", h = " + height + ", pf = " + pixelFormat + ", v = " + videoId+"degree"+degree);
            }
        }

    private val mPlayerCompletionListener: IjkVideoView.IVideoView.OnCompletionListener =
        object : IjkVideoView.IVideoView.OnCompletionListener {
            override fun onCompletion(videoView: IjkVideoView?) {
                mVideoView!!.stopPlayback()
                mVideoView!!.release(true)
                mVideoView!!.stopBackgroundPlay()
            }
        }

    private fun onStartPlayback() {
        showToast("start show")
        // 隐藏ProgressBar
        mProgressBar!!.visibility = View.INVISIBLE
        UdpTaskCenter.sharedCenter()!!.listen("192.168.1.1", 8990)
        UdpTaskCenter.sharedCenter()!!.heartBeatTask()
        UdpTaskCenter.sharedCenter()!!.setSendHeartBeat(true)
    }

    private fun stopAndRestartPlayback() {
        mProgressBar!!.visibility = View.VISIBLE
        mVideoView!!.post {
            mVideoView!!.stopPlayback()
            mVideoView!!.release(true)
            mVideoView!!.stopBackgroundPlay()
        }
        mVideoView!!.postDelayed({
            mVideoView!!.setRender(VIDEO_VIEW_RENDER)
            mVideoView!!.setAspectRatio(VIDEO_VIEW_ASPECT)
            mVideoView!!.setVideoPath(mVideoPath)
            mVideoView!!.start()
        }, RECONNECT_INTERVAL.toLong())
    }

    // 新API
    fun sendData(data: ByteArray?) {
        // Send
        try {
            mVideoView!!.sendData(data)
        } catch (e: java.lang.Exception) {
            e.printStackTrace()
        }
    }

    private fun takePhoto(num: Int) {
        // Take a photo
        val photoFilePath: String =
            getPhotoDirPath()!!
        val photoFileName: String =
            getMediaFileName()
        try {
            mVideoView!!.takePicture(photoFilePath, photoFileName, -1, -1, num)
        } catch (e: java.lang.Exception) {
            e.printStackTrace()
        }
    }

    private fun recordVideo() {
        if (recording) {
            if (inserting) mVideoView!!.stopInsertVideo()
            mVideoView!!.stopRecordVideo()
        } else {
            val videoFilePath: String =
                getVideoDirPath()!!
            val videoFileName: String =
                getMediaFileName()
            // Start to record video
            try {
                mVideoView!!.startRecordVideo(videoFilePath, videoFileName, -1, -1)
            } catch (e: java.lang.Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun insertVideo() {
        if (inserting) {
            if (mInsertTimer != null) {
                mInsertTimer.purge()
                mInsertTimer.cancel()
            }
            mVideoView!!.stopInsertVideo()
        } else {
            // cif, yuv444p
            mVideoView!!.startInsertVideo(356, 288, 5)
        }
    }

    private fun setOutputVideo() {
        bOutputVideo = !bOutputVideo
        mVideoView!!.setOutputVideo(bOutputVideo)
        mVideoView!!.setOutputOriginalVideo(!bOutputVideo)
    }

    private fun setVrMode(en: Boolean) {
        mVideoView!!.isVrMode = en
    }

    private fun setVideoRotation(degree: Int) {
        mVideoView!!.setVideoRotation(degree)
    }

    private fun setVideoRotation180(enable: Boolean) {
        mVideoView!!.setRotation180(enable)
    }

    private fun showToast(s: String) {
        Toast.makeText(this.context, s, Toast.LENGTH_SHORT).show()
    }

    /* 以下是Demo使用到的方法 */
    private val HOME_PATH_NAME = "MediaStream"

    // 照片和视频的子目录名
    private val PHOTO_PATH_NAME = "Image"
    private val VIDEO_PATH_NAME = "Movie"


    fun getHomePath(): String? {
        var homePath: String? = null
        try {
            val extStoragePath = Environment.getExternalStorageDirectory().getCanonicalPath()
            val homeFile = File(
                extStoragePath,
                HOME_PATH_NAME
            )
            homePath = homeFile.getCanonicalPath()
        } catch (e: java.lang.Exception) {
            e.printStackTrace()
        }
        return homePath
    }

    fun getSubDir(parent: String?, dir: String?): String? {
        if (parent == null) return null
        var subDirPath: String? = null
        try {
            // 获取展开的子目录路径
            val subDirFile = File(parent, dir)
            if (!subDirFile.exists()) subDirFile.mkdirs()
            subDirPath = subDirFile.getCanonicalPath()
        } catch (e: java.lang.Exception) {
            e.printStackTrace()
        }
        return subDirPath
    }

    fun getPhotoPath(): String? {
        return getSubDir(
            getHomePath(),
            PHOTO_PATH_NAME
        )
    }

    fun getVideoPath(): String? {
        return getSubDir(
            getHomePath(),
            VIDEO_PATH_NAME
        )
    }

    fun getPhotoDirPath(): String? {
        val photoPath: String = getPhotoPath()
            ?: return null

        // 如果文件夹不存在, 则创建
        val photoDir = File(photoPath)
        if (!photoDir.exists()) {
            // 创建失败则返回null
            if (!photoDir.mkdirs()) return null
        }
        return photoDir.absolutePath
    }

    fun getVideoDirPath(): String? {
        val videoPath: String = getVideoPath()
            ?: return null

        val videoDir = File(videoPath)
        if (!videoDir.exists()) {
            if (!videoDir.mkdirs()) return null
        }
        return videoDir.absolutePath
    }

    fun getMediaFileName(): String {
        val date = Date()
        val format =
            SimpleDateFormat("yyyyMMdd_HHmmsss", Locale.getDefault())
        //        String photoFileName = dateString + "." + PHOTO_FILE_EXTENSION;
        return format.format(date)
    }

    private fun setTakePhotoCallBack() {
        UdpTaskCenter.sharedCenter()!!.setOnTakePhoto(object : UdpTaskCenter.OnTakePhoto {
            override fun takercvPhoto() {
                takePhoto(1)
            }
        })
    }


    private fun removetTakePhotoCallBack() {
        UdpTaskCenter.sharedCenter()!!.removeTakePhoto()
    }


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.activity_preview, container, false)
//        return inflater.inflate(R.layout.fragment_bo, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
    }

    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @param param1 Parameter 1.
         * @param param2 Parameter 2.
         * @return A new instance of fragment MeasurementFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance(param1: String, param2: String) =
            CameraPreviewFragment().apply {
                arguments = Bundle().apply {
//                    putString(com.remote_medical_care_2.ARG_PARAM1, param1)
//                    putString(com.remote_medical_care_2.ARG_PARAM2, param2)
                }
            }
    }
}