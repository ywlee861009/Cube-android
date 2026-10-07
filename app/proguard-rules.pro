# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.kts.

# - @JavascriptInterface 메서드는 proguard-android-optimize.txt 기본 규칙이 보존한다.
# - Kotlin stdlib / AdMob / CameraX / Play 라이브러리는 자체 consumer rule을 포함하므로
#   전체 패키지 keep 을 두지 않는다. (kotlin.** keep 이 seeds 의 88% 를 차지해 축소를 막았음)
# - 리플렉션 기반 직렬화(Gson, kotlinx.serialization 등)를 도입하면 여기에 keep 을 추가할 것.
