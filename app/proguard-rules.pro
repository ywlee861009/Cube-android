# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.kts.

# Kotlin
-keep class kotlin.** { *; }
-keep class kotlinx.** { *; }

# Keep data classes
-keepclassmembers class com.kero.cubie.** {
    public <init>(...);
}
