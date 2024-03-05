# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

-renamesourcefileattribute SourceFile
-keepattributes SourceFile,LineNumberTable

-keepattributes *Annotation*

-keep class tv.danmaku.ijk.media.player.annotations.*
-keepclasseswithmembers class * {
    native <methods>;
    @tv.danmaku.ijk.media.player.annotations.CalledByNative <methods>;
    @tv.danmaku.ijk.media.player.annotations.AccessedByNative <fields>;
}

-keep interface tv.danmaku.ijk.media.player.misc.* { *; }

-keep class com.squareup.otto.*
-keepclasseswithmembers class * {
    @com.squareup.otto.Subscribe <methods>;
}
