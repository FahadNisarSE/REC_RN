package com.remote_medical_care_2.cameramodule

import android.content.Context
import android.net.wifi.WifiManager
import android.net.wifi.WifiManager.MulticastLock
import android.util.Log
import java.io.IOException
import java.io.InterruptedIOException
import java.net.DatagramPacket
import java.net.DatagramSocket
import java.net.InetAddress
import java.net.InetSocketAddress
import java.net.SocketException
import java.util.Arrays

class UdpTaskCenter private constructor() {
    private val ipAddress: String? = null

    private val port = 0
    private var socket: DatagramSocket? = null
    private var rcvThread: Thread? = null
    private var sendThread: Thread? = null
    private val callbackThread: Thread? = null
    private val callBackTick = 0
    private val nowDegree = 0
    private var isSendHeartBeat = false
    private val listenPort = 8990
    private var isStop = false
    private var lastTakePhotoTick: String? = null
    private val delayTick = 0
    private val waitTick = 0
    private var connectedCallback: OnServerConnectedCallbackBlock? = null

    private var disconnectedCallback: OnServerDisconnectedCallbackBlock? = null

    private var receivedCallback: OnReceiveCallbackBlock? = null
    private var receiveBatteryCallback: OnReceiveBattery? = null
    private var takePhotoCallBack: OnTakePhoto? = null
    fun setSendHeartBeat(isSendHeartBeat: Boolean) {
        this.isSendHeartBeat = isSendHeartBeat
    }

    fun heartBeatTask() {
        if (sendThread != null) return
        sendThread = Thread {
            while (true) {
                val message = ByteArray(2048)
                try {
                    if (socket == null) {
                        Log.e(TAG, "create sendThread")
                        socket = DatagramSocket(null)
                        socket!!.setReuseAddress(true)
                        socket!!.bind(InetSocketAddress(listenPort))
                    }
                    val address = InetAddress.getByName("192.168.1.1")
                    val data = "PLAYSTATE:" + if (isSendHeartBeat) 1 else 0
                    val dataByte = data.toByteArray() //建立数据

                    Log.e(TAG, "data byte" + dataByte.toString())
                    val packet =
                        DatagramPacket(dataByte, dataByte.size, address, 8990) //通过该数据建包
                    socket!!.send(packet) //开始发送该包
                    try {
                        Thread.sleep(500)
                    } catch (e: InterruptedException) {
                        e.printStackTrace()
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
        sendThread!!.start()
    }

    var multicastLock: MulticastLock? = null

    //    构造函数私有化
    init {
        try {
            socket = DatagramSocket(null)
            socket!!.setReuseAddress(true)
            socket!!.bind(InetSocketAddress(listenPort))
        } catch (e: SocketException) {
            e.printStackTrace()
        }
    }

    /**
     * 通过IP地址(域名)和端口进行连接
     *
     * @param ipAddress IP地址(域名)
     * @param port      端口
     */
    fun listen(ipAddress: String?, port: Int) {
        val wserviceName = Context.WIFI_SERVICE
//        val mWifiManager =
//            GoSkyApplication.getApplication().getSystemService(wserviceName) as WifiManager
//        multicastLock = mWifiManager.createMulticastLock("multicast.test")
        if (rcvThread != null) {
            Log.e(TAG, "heartBeatTask already exit")
            return
        }
        rcvThread = Thread {
//            multicastLock.acquire()
            val message = ByteArray(1024)
            try {
                // 建立Socket连接
                if (socket == null) {
                    Log.e(TAG, "create listen")
                    socket = DatagramSocket(null)
                    socket!!.setReuseAddress(true)
                    socket!!.bind(InetSocketAddress(listenPort))
                }
                while (true) {
                    // 准备接收数据
                    Arrays.fill(message, 0.toByte())
                    val packet = DatagramPacket(message, message.size)
                    try {
                        socket!!.receive(packet) //接收数据
                    } catch (e: InterruptedIOException) {
                        continue  //非阻塞循环Operation not permitted
                    }
                    val str_message = convertStandardJSONString(
                        String(
                            packet.data,
                            charset("UTF-8")
                        ).trim { it <= ' ' })
                    if (str_message.length < 1) continue
                    val ip_address = packet.address.hostAddress.toString()
                    val port_int = packet.port
                     Log.e(TAG,"msg"+str_message);
                    val address = InetAddress.getByName("192.168.1.1")
                    val map = parseResponseString(str_message)
                    val takePhoto = map["TAKE_PHOTO"]
                    if (takePhoto != null && takePhotoCallBack != null && !takePhoto.equals(
                            lastTakePhotoTick,
                            ignoreCase = true
                        )
                    ) {
                        takePhotoCallBack!!.takercvPhoto()
                        lastTakePhotoTick = takePhoto
                    }
                    var power = map["POWER_TIME"]
                    if (power == null) {
                        power = map["POWER_LEVEL"]
                    }
                    if (power != null) {
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        isStop = false
        rcvThread!!.start()
        //callbackTimer();
    }

    // public String getPower(){
    //  }
    fun convertStandardJSONString(data_json: String): String {
        var data_json = data_json
        data_json = data_json.replace("\\\\r\\\\n".toRegex(), "")
        data_json = data_json.replace("\"{", "{")
        data_json = data_json.replace("}\",", "},")
        data_json = data_json.replace("}\"", "}")
        return data_json
    }

    /**
     * 回调声明
     */
    interface OnServerConnectedCallbackBlock {
        fun callback()
    }

    interface OnServerDisconnectedCallbackBlock {
        fun callback(e: IOException?)
    }

    interface OnReceiveCallbackBlock {
        fun callback(type: Int, receicedMessage: String?)
    }

    interface OnReceiveBattery {
        fun callback(battery: String?)
    }

    interface OnTakePhoto {
        fun takercvPhoto()
    }

    fun setOnTakePhoto(callback: OnTakePhoto?) {
        takePhotoCallBack = callback
    }

    fun removeTakePhoto() {
        takePhotoCallBack = null
    }

    fun setConnectedCallback(connectedCallback: OnServerConnectedCallbackBlock?) {
        this.connectedCallback = connectedCallback
    }

    fun setDisconnectedCallback(disconnectedCallback: OnServerDisconnectedCallbackBlock?) {
        this.disconnectedCallback = disconnectedCallback
    }

    fun setReceivedCallback(receivedCallback: OnReceiveCallbackBlock?) {
        this.receivedCallback = receivedCallback
    }

    fun setReceiveBatteryCallback(receivedCallback: OnReceiveBattery?) {
        receiveBatteryCallback = receivedCallback
    }

    /**
     * Parse response
     *
     * @param responseString
     * @return
     */
    private fun parseResponseString(responseString: String?): HashMap<String, String> {
        val map = HashMap<String, String>()
        if (responseString != null) {
            val stringArray =
                responseString.split("\\r\\n".toRegex()).dropLastWhile { it.isEmpty() }
                    .toTypedArray() // regex
            // Log.e("arsen","stringArray"+stringArray.length+"    "+stringArray[0]+"length "+stringArray[0].length());
            for (i in stringArray.indices) {
                //    Log.e("arsen",i+"stringArray []"+stringArray[i]);
            }
            if (!stringArray[0].trim { it <= ' ' }.equals("{", ignoreCase = true)) {
                return map
            }
            for (i in 1 until stringArray.size - 1) {
                var type = stringArray[i]
                type = type.replace(" ", "")
                val infoArray = type.split(":".toRegex()).dropLastWhile { it.isEmpty() }
                    .toTypedArray()
                if (infoArray.size == 2) {
                    map[infoArray[0].replace("\"", "").trim { it <= ' ' }] =
                        infoArray[1].replace(",", "").replace("\"", "").trim { it <= ' ' }
                } else if (infoArray.size == 1) {
                    map[infoArray[0].replace("\"", "").trim { it <= ' ' }] = "1"
                }
            }
        }
        return map
    }

    /**
     * 移除回调
     */
    fun removeCallback() {
        connectedCallback = null
        disconnectedCallback = null
        receivedCallback = null
        receiveBatteryCallback = null
    }

    fun UdpTaskrelease() {
        Log.e(TAG, "UdpTaskrelease$isStop")
        if (isStop == false) {
            isStop = true
            removeCallback()
        }
    }

    companion object {
        private var instance: UdpTaskCenter? = null
        private const val TAG = "UdpTaskCenter"

        //    提供一个全局的静态方法
        fun sharedCenter(): UdpTaskCenter? {
            if (instance == null) {
                synchronized(UdpTaskCenter::class.java) {
                    if (instance == null) {
                        instance = UdpTaskCenter()
                    }
                }
            }
            return instance
        }
    }
}
