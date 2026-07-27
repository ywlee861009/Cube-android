plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.kero.cubie"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.kero.cubie"
        minSdk = 26
        targetSdk = 36
        versionCode = 9
        versionName = "1.1.2"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.activity)
    implementation(libs.google.admob)
    implementation(libs.google.app.update)
    implementation(libs.androidx.camera.core)
    implementation(libs.androidx.camera.camera2)
    implementation(libs.androidx.camera.lifecycle)
    implementation(libs.androidx.camera.view)
    implementation(libs.guava)

    // IF-018: 직접 사용하지 않지만 AdMob가 끌어오는 transitive androidx.fragment 1.1.0 이
    // Play Console에서 구버전으로 신고됨 → constraint 로 최신 버전 강제.
    constraints {
        implementation(libs.androidx.fragment) {
            because("Play Console IF-018: transitive androidx.fragment 1.1.0 구버전 → 최신으로 상향")
        }
    }

    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
}
