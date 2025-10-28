import UIKit
import React
import Lottie

@objc(AppDelegate)
@UIApplicationMain
class AppDelegate: RCTAppDelegate, RNAppAuthAuthorizationFlowManager {

  // MARK: - RNAppAuthAuthorizationFlowManager

  weak var authorizationFlowManagerDelegate: RNAppAuthAuthorizationFlowManagerDelegate?

  // MARK: - UIApplicationDelegate

  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {

    moduleName = "bedfellow"
    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    initialProps = [:]

    let success = super.application(application, didFinishLaunchingWithOptions: launchOptions)

    if success, let rootView = self.window.rootViewController?.view {
      // Set background color
      rootView.backgroundColor = UIColor.white

      // Create Lottie animation view
      let dynamic = Dynamic()
      let animationView = dynamic.createAnimationView(rootView: rootView, lottieName: "loading")

      // Register LottieSplashScreen to RNSplashScreen
      RNSplashScreen.showLottieSplash(animationView, inRootView: rootView)

      // Play animation
      dynamic.play(animationView: animationView)

      // Force animation layout to be removed when hide is called
      RNSplashScreen.setAnimationFinished(true)
    }

    return success
  }

  override func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {

    if let delegate = authorizationFlowManagerDelegate,
       delegate.resumeExternalUserAgentFlow(with: url) {
      return true
    }

    return RCTLinkingManager.application(app, open: url, options: options)
  }

  override func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {

    if userActivity.activityType == NSUserActivityTypeBrowsingWeb,
       let webpageURL = userActivity.webpageURL,
       let delegate = authorizationFlowManagerDelegate,
       delegate.resumeExternalUserAgentFlow(with: webpageURL) {
      return true
    }

    return RCTLinkingManager.application(
      application,
      continue: userActivity,
      restorationHandler: restorationHandler
    )
  }

  // MARK: - RCTAppDelegate
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    return bundleURL()
  }

  override func bundleURL() -> URL? {
    #if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
}
