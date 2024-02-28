package com.remote_medical_care_2.cameramodule

import android.util.Log
import java.io.IOException
import java.io.InputStream
import java.io.OutputStream
import java.net.InetSocketAddress
import java.net.Socket
class TCPClient private constructor() {
    private val instance: TCPClient? = null

    @get:Throws(IOException::class)
    val info: Unit
        get() {
            Thread {
                val client = Socket()
                //2.
                val address = InetSocketAddress("192.168.1.1", 7070)
                try {
                    client.connect(address)
                    var outputStream: OutputStream? = null
                    outputStream = client.getOutputStream()
                    outputStream.write("GETINFO /webcam APP0/1.0".toByteArray())
                    var inputStream: InputStream? = null
                    inputStream = client.getInputStream()
                    val bt = ByteArray(1024)
                    val length = inputStream.read(bt)
                    // if(length < 1)
                    //   continue;
                    val bs = ByteArray(length)
                    System.arraycopy(bt, 0, bs, 0, length)
                    val str = String(bs, charset("UTF-8"))
                    Log.e("arsen", "rece data$str")
                    client.close()
                } catch (e: IOException) {
                    e.printStackTrace()
                }
            }.start()
        }

    companion object {


        private var instance: TCPClient? = null
        private const val TAG = "TCPClient"

        fun getInstance(): TCPClient? {
            if (instance == null) {
                synchronized(UdpTaskCenter::class.java) {
                    if (instance == null) {
                        instance = TCPClient()
                    }
                }
            }
            return instance
        }
    }

}